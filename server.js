const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ethers } = require("ethers");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Адрес вашего контракта
const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Настроен на локальный RPC

// Используйте ваш приватный ключ здесь (или из .env)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractABI = require("./artifacts/contracts/SoulboundNFT.sol/SoulboundNFT.json").abi;

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Эндпоинт для создания токенов
app.post("/mint", async (req, res) => {
    try {
        const { address, name, surname, workplace, imageUrl } = req.body; // Получаем все данные из тела запроса

        // Проверяем, является ли адрес корректным
        if (!ethers.isAddress(address)) {
            return res.status(400).send({ error: "Invalid address" });
        }

        const tx = await contract.mint(address, name, surname, workplace, imageUrl); // Передаем все параметры в mint
        await tx.wait();
        res.send({ status: "Minted", tx });

    } catch (error) {
        console.log("Mint Error:", error);
        res.status(500).send({ error: error.message });
    }
});

// Эндпоинт для отзыва токенов
app.post("/revoke", async (req, res) => {
    try {
        const { tokenId } = req.body; // Получаем идентификатор токена из тела запроса

        // Проверяем, является ли tokenId корректным
        if (!Number.isInteger(tokenId) || tokenId < 0) {
            return res.status(400).send({ error: "Invalid token ID" });
        }

        const tx = await contract.revoke(tokenId);
        await tx.wait();
        res.send({ status: "Revoked", tx });
    } catch (error) {
        console.error("Revoke Error:", error);
        res.status(500).send({ error: error.message });
    }
});

// Эндпоинт для получения владельца
app.get("/owner", async (req, res) => {
    try {
        const ownerAddress = await contract.getOwner(); // Вызов функции getOwner
        res.send({ owner: ownerAddress });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});

app.post('/transfer-ownership', async (req, res) => {
    const { newOwner } = req.body;
    // Логика передачи прав собственности
    // Например, вызов функции контракта
    try {
        const tx = await contract.transferOwnership(newOwner);
        await tx.wait();
        res.status(200).json({ message: 'Ownership transferred successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/metadata/:tokenId", async (req, res) => {
    try {
        const tokenId = req.params.tokenId; // Получаем идентификатор токена из параметров

        // Проверяем, является ли tokenId корректным
        if (!Number.isInteger(+tokenId) || tokenId <= 0) {
            return res.status(400).send({ error: "Invalid token ID" });
        }

        const metadata = await contract.getTokenMetadata(tokenId); // Получаем метаданные токена
        res.send({ metadata }); // Возвращаем метаданные

    } catch (error) {
        console.error("Metadata Fetch Error:", error);
        res.status(500).send({ error: error.message });
    }
});

// Запуск сервера на порту 3000
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
