#!/usr/bin/env node

import fs from "fs";
import path from "path";

const args = process.argv.slice(2);

function parseArgs(rawArgs) {
  const options = {};
  const positional = [];
  const leadingPositional = [];
  let encounteredOption = false;

  for (let i = 0; i < rawArgs.length; i += 1) {
    const token = rawArgs[i];
    if (!token.startsWith("--")) {
      positional.push(token);
      if (!encounteredOption) {
        leadingPositional.push(token);
      }
      continue;
    }

    encounteredOption = true;
    const key = token.slice(2);
    const value = rawArgs[i + 1];
    if (!value || value.startsWith("--")) {
      options[key] = "true";
      continue;
    }

    options[key] = value;
    i += 1;
  }

  return { options, positional, leadingPositional };
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const { options, leadingPositional } = parseArgs(args);

const title = options.title ?? leadingPositional.join(" ");

if (!title) {
  console.error(
    'Usage: npm run new:post -- "Post Title" [--slug custom-slug] [--tags research,notes] [--type "blog post"] [--date YYYY-MM-DD] [--thumbnail /posts/your-image.webp] [--abstract "Short summary"]'
  );
  process.exit(1);
}

const today = new Date();
const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const slug = options.slug ?? slugify(title);
const type = options.type ?? "blog post";
const tagsCsv = options.tags ?? "research";
const date = options.date ?? formattedDate;
const abstract = options.abstract ?? "Write a short summary of this post.";
const thumbnail = options.thumbnail ?? "/posts/thumbnail.webp";

if (!slug) {
  console.error("Could not build a slug. Pass one manually with --slug.");
  process.exit(1);
}

const tags = tagsCsv
  .split(/[,\s]+/)
  .map((tag) => tag.trim())
  .filter(Boolean);

const tagsYaml = `[${tags.map((tag) => `'${tag}'`).join(", ")}]`;

const content = `---
type: '${type}'
title: '${title.replace(/'/g, "''")}'
date: '${date}'
tags: ${tagsYaml}
abstract: '${abstract.replace(/'/g, "''")}'
thumbnail: '${thumbnail}'
---

# ${title}

Write your post here.
`;

const postsDirectory = path.join(process.cwd(), "posts");
const outputPath = path.join(postsDirectory, `${slug}.md`);

if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true });
}

if (fs.existsSync(outputPath)) {
  console.error(`Post already exists: ${outputPath}`);
  process.exit(1);
}

fs.writeFileSync(outputPath, content, "utf8");
console.log(`Created ${path.relative(process.cwd(), outputPath)}`);
