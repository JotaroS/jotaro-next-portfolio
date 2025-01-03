import json
import tkinter as tk

FONT_TYPE = "meiryo"
JSON_FILE_PATH = "./public/publications_dev.json"
JSON_OUT_DEV_PATH = "./public/publications_dev.json"


class PublicationItem:
    def __init__(
        self,
        idx=None,
        title : str =None,
        authors=None,
        year=None,
        conference=None,
        type_: str = "proceedings",
        award : str =None,
    ) -> None:
        self.title = title
        self.authors = authors
        self.year = year
        self.conference = conference
        self.idx = None
        self.type = type_  # proceedings or journal
        self.award = None

    def __str__(self)->str:
        return f"{self.title} ({self.year}) by {self.authors} in {self.conference}"

    def __repr__(self)->str:
        return self.__str__()


class App(tk.Tk):
    def __init__(self)->None:
        super().__init__()

        # メンバー変数の設定
        self.fonts = (FONT_TYPE, 15)
        # フォームサイズ設定
        self.geometry("850x650")
        self.title("Basic GUI")

        # window position
        self.positionRight = int(self.winfo_screenwidth() / 2 - 850 / 2)

        # フォームのセットアップをする
        self.setup_form()
        self.setup_list()

        self.publications = self.load_publications()

    def setup_list(self):
        # リストボックスを表示する
        self.listbox = tk.Listbox(master=self, width=30, height=20, font=self.fonts)
        self.listbox.grid(column=0, row=0, rowspan=8)
        self.add_button = tk.Button(
            master=self, text="Add", font=self.fonts, command=self.add_button_function
        )
        self.add_button.grid(column=0, row=8)

        self.save_button = tk.Button(
            master=self, text="Save", font=self.fonts, command=self.save_button_function
        )
        self.save_button.grid(column=0, row=9)

    def setup_form(self):
        self.label = tk.Label(
            master=self, text="Title", font=self.fonts, width=10, anchor="e"
        )
        self.label.grid(column=1, row=0)
        self.title_textbox = tk.Entry(master=self, width=40, font=self.fonts)
        self.title_textbox.grid(column=2, row=0)

        self.label = tk.Label(
            master=self, text="Authors", font=self.fonts, width=10, anchor="e"
        )
        self.label.grid(column=1, row=1)
        self.authors_textbox = tk.Entry(master=self, width=40, font=self.fonts)
        self.authors_textbox.grid(column=2, row=1)

        self.label = tk.Label(
            master=self, text="Year", font=self.fonts, width=10, anchor="e"
        )
        self.label.grid(column=1, row=2)
        self.year_textbox = tk.Entry(master=self, width=40, font=self.fonts)
        self.year_textbox.grid(column=2, row=2)

        self.label = tk.Label(
            master=self, text="Conference", font=self.fonts, width=10, anchor="e"
        )
        self.label.grid(column=1, row=3)
        self.conference_textbox = tk.Entry(master=self, width=40, font=self.fonts)
        self.conference_textbox.grid(column=2, row=3)

        # radio button with content "proceedings" and "journal"
        self.label = tk.Label(
            master=self, text="Type", font=self.fonts, width=10, anchor="e"
        )
        self.label.grid(column=1, row=4)
        self.type_var = tk.StringVar()
        self.type_var.set("proceedings")
        self.proceedings_radio = tk.Radiobutton(
            master=self,
            text="Proceedings",
            variable=self.type_var,
            value="proceedings",
            font=self.fonts,
        )
        self.proceedings_radio.grid(column=2, row=4)
        self.journal_radio = tk.Radiobutton(
            master=self,
            text="Journal",
            variable=self.type_var,
            value="journal",
            font=self.fonts,
        )
        self.journal_radio.grid(column=2, row=5)

        self.label = tk.Label(
            master=self, text="Award", font=self.fonts, width=10, anchor="e"
        )
        self.label.grid(column=1, row=6)
        self.award_textbox = tk.Entry(master=self, width=40, font=self.fonts)
        self.award_textbox.grid(column=2, row=6)


    def add_button_function(self):
        if self.title_textbox.get() == "":
            print("title is empty")
            return
        authos_list = self.authors_textbox.get().split(", ")
        pubilcation_blank = PublicationItem(
            title=self.title_textbox.get(),
            authors=authos_list,
            year=int(self.year_textbox.get()),
            conference=self.conference_textbox.get(),
            type=self.type_var.get(),
            award=self.award_textbox.get(),
        )
        print(pubilcation_blank)
        self.publications.append(pubilcation_blank)
        self.listbox.insert(tk.END, pubilcation_blank)

        # clear all textboxes
        self.title_textbox.delete(0, tk.END)
        self.authors_textbox.delete(0, tk.END)
        self.year_textbox.delete(0, tk.END)
        self.conference_textbox.delete(0, tk.END)

        self.publications = sorted(
            self.publications, key=lambda x: x.year, reverse=True
        )
        self.save_button_function()

    def save_button_function(self):
        with open(JSON_OUT_DEV_PATH, "w") as f:
            json.dump(
                [vars(publication) for publication in self.publications], f, indent=4
            )

        print("saved")

    def load_publications(self):
        publications = []
        with open(JSON_FILE_PATH) as f:
            data = json.load(f)
        # データを表示する
        for idx, item in enumerate(data):
            publication = PublicationItem(
                idx=idx,
                title=item["title"],
                authors=item["authors"],
                year=item["year"],
                conference=item["conference"],
                type_=item["type"],
                # award=item["award"],
            )
            print(publication)
            publications.append(publication)

        # sort by year
        publications = sorted(publications, key=lambda x: x.year, reverse=True)
        for publication in publications:
            self.listbox.insert(tk.END, publication)
        return publications


if __name__ == "__main__":
    # アプリケーション実行
    app = App()
    app.mainloop()
