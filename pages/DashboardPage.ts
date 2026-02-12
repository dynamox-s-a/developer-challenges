import { expect, Page } from '@playwright/test'

export class DashboardPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async visit() {
    await this.page.goto('/')
  }
}