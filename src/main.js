import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fetch from "node-fetch";

dotenv.config();

(async function main() {
  console.log("🚀 Running weather report");

  const locationRequest = await fetch(
    `http://dataservice.accuweather.com/locations/v1/cities/BR/search?q=${encodeURIComponent(
      "Teresina, Piauí"
    )}&apikey=${process.env.ACCU_WEATHER_API_KEY}`
  );
  const locationData = await locationRequest.json();
  const locationKey = locationData[0].Key;

  const forecastRequest = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${process.env.ACCU_WEATHER_API_KEY}`
  );
  const forecastData = await forecastRequest.json();

  const temperature = forecastData.DailyForecasts[0].Temperature;

  const tenorRequest = await fetch(
    `https://g.tenor.com/v1/search?key=${process.env.TENOR_API_KEY}&limit=1&contentfilter=low`
  );
  const tenorData = await tenorRequest.json();

  const gif = tenorData.results[0].media;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER_EMAIL,
      pass: process.env.MAIL_USER_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Esaú Morais 🧑‍💻" <${process.env.MAIL_FROM}>`, // sender address
    to: process.env.MAIL_TO, // list of receivers
    subject: "✔ Daily weather report", // Subject line
    text: `
            ☁️ Daily weather report

            Weather
            - Forecast: ${forecastData.Headline.Text}
            ➡️ Min: ${temperature.Minimum.Value}° ${temperature.Minimum.Unit}
            ➡️ Max: ${temperature.Maximum.Value}° ${temperature.Maximum.Unit}

            Daily GIF: ${gif[0].tinygif.url}
        `, // plain text body
    html: `
            <h1>Daily weather report</h1>
            <h2>Weather</h2>
            <p><img src="${gif[0].tinygif.url}" /></p>
            <p>Forecast: ${forecastData.Headline.Text}</p>
            <p>➡️ Min: ${temperature.Minimum.Value}° ${temperature.Minimum.Unit}</p>
            <p>➡️ Max: ${temperature.Maximum.Value}° ${temperature.Maximum.Unit}</p>
        `, // html body
  });
})();
