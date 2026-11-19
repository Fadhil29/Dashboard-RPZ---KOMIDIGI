export class RtbhPage {
  constructor(page) {
    this.page = page;
  }

  heading(name) {
    return this.page.getByRole('heading', { name });
  }

  text(content) {
    return this.page.getByText(content);
  }
}