const { expect } = require("chai");
const { deploySoulboundNFT } = require("../scripts/deploy");

describe("SoulboundNFT Deployment", function () {
    let soulboundNFT;

    before(async function () {
        // Вызываем функцию развертывания перед каждым тестом
        soulboundNFT = await deploySoulboundNFT();
    });

    it("Should have the correct name and symbol", async function () {
        expect(await soulboundNFT.name()).to.equal("SoulboundNFT");
        expect(await soulboundNFT.symbol()).to.equal("SBNFT");
    });

    it("Should set the right owner", async function () {
        const [owner] = await ethers.getSigners();
        expect(await soulboundNFT.owner()).to.equal(owner.address);
    });
});
