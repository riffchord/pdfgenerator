const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express();
const port = 666;

// Body Parser Middleware
app.use(bodyParser.json());

app.post('/generate-pdf', async (req, res) => {
    // Extract URL from request body
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.emulateMediaType('screen');

        const pdf = await page.pdf({
            margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
            printBackground: false,
            format: 'A4',
        });

        await browser.close();

        res.contentType('application/pdf');
        res.send(pdf);
    } catch (error) {
        res.status(500).send({ error: 'Failed to generate PDF' });
    }
});

app.listen(port, () => {
    console.log(`PDF Generator API listening at http://localhost:${port}`);
});
