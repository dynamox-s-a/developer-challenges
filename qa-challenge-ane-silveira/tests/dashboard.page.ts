import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;


    constructor(page: Page) {
        this.page = page;
    }

    async goto(){
        await this.page.goto('https://frontend-test-for-qa.vercel.app/');
    }

    async reloadPage(){
        await this.page.reload({timeout: 60000});
    }
}