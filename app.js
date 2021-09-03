const Discord = require("discord.js");
var axios = require("axios");
const { resolve } = require("path");
require("dotenv").config()

// configs
const hienRedXLSoftConfig = {
	name: "Hien (XL,Soft,Red)",
	data: "kuni=on&sir=141&size=4&color=1",
	inStock: false
};

const hienBlackXLSoftConfig = {
	name: "Hien (XL,Soft,Black)",
	data: "kuni=on&sir=141&size=4&color=5",
	inStock: false
};

// consts
// const client = new Discord.Client({ _tokenType: "" }); // use this if using a user bot (Against Discord TOS)
const client = new Discord.Client();
const myAcc = new Discord.User(client, { id: process.env.DISCORD_ID });
const inStockPattern = new RegExp(/^[0-z]+(?=\/)/g);
const CONFIGS_ARR = [hienRedXLSoftConfig];
const CONFIGS = new Map();
for (let config of CONFIGS_ARR) {
	CONFIGS[config.name] = config;
}

// counter
let stockChecks = 0;

// funcs
const messageMe = (msg) => {
	myAcc.send(msg)
		.then(message => console.log(`Sent message: ${message.content}`))
		.catch(console.error);
}

const checkStock = (postData) => {
	let config = {
		method: "post",
		url: "https://www.artisan-jp.com/get_syouhin.php",
		headers: {
			"Connection": "keep-alive",
			"Accept": "text/plain,*/*; q=0.01",
			"X-Requested-With": "XMLHttpRequest",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,like Gecko) Chrome/93.0.4577.58 Safari/537.36",
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"Sec-GPC": "1",
			"Origin": "https://www.artisan-jp.com",
			"Sec-Fetch-Site": "same-origin",
			"Sec-Fetch-Mode": "cors",
			"Sec-Fetch-Dest": "empty",
			"Referer": "https://www.artisan-jp.com/fx-hien-eng.html",
			"Accept-Language": "en-US,en;q=0.9",
			"Cookie": "lung=jpf"
		},
		data: postData
	};
	
	return new Promise((resolve) => {
		axios(config)
		.then((response) => {
			let data = new String(response.data);
			let stockValue = data.match(inStockPattern)[0];
			if (stockValue !== "NON") {
				resolve(true);
			}
			resolve(false);
		})
		.catch((error) => {
			resolve(false);
		});
	});
}

// loops checking stock
const trackStock = (config, delay) => {
	stockChecks++;
	
	checkStock(config.data).then(inStock => {
		console.log(`Stock check for ${config.name}: ${inStock} - #${stockChecks}`);
		if (inStock && !((CONFIGS[config.name]).inStock)) {
			CONFIGS[config.name].inStock = true;
			messageMe(`In Stock: ${config.name} | https://www.artisan-jp.com/fx-hien-eng.html`);
		} else if (!inStock) {
			CONFIGS[config.name].inStock = false;
		}
	});

	setTimeout(trackStock, delay, CONFIGS[config.name], delay);
}

client.on("ready", () => {
	let msg = "sending you updates on when the Artisan Hien is back in stock...";
	messageMe(msg);
});

 client.login(process.env.DISCORD_TOKEN);

let min = 1, interval = min * 60 * 1000;
trackStock(hienRedXLSoftConfig, interval);