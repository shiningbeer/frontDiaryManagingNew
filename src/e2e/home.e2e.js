import Nightmare from 'nightmare';

describe('Homepage', () => {
  it('it should have logo text', async () => {
    const page = Nightmare().goto('http://localhost:8000');
    const text = await page.wait('h1').evaluate(() => document.body.innerHTML).end();
    expect(text).toContain('<h1>泛智能扫描平台</h1>');
  });
});
