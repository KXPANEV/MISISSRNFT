const { expect } = require("chai");

describe("SoulboundNFT", function () {
    let SoulboundNFT;
    let soulboundNFT;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        SoulboundNFT = await ethers.getContractFactory("SoulboundNFT");
        [owner, addr1, addr2] = await ethers.getSigners();

        // Разворачиваем контракт
        soulboundNFT = await SoulboundNFT.deploy();
        // Убедитесь, что здесь НЕТ вызова .deployed()
        // await soulboundNFT.deployed(); // Убедитесь, что это закомментировано или удалено
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await soulboundNFT.owner()).to.equal(owner.address);
        });
    });

    describe("Minting", function () {
        it("Should mint a token to the owner", async function () {
            await soulboundNFT.mint(owner.address);
            expect(await soulboundNFT.ownerOf(0)).to.equal(owner.address);
        });

        it("Should revert when minting by a non-owner", async function () {
            await expect(soulboundNFT.connect(addr1).mint(addr1.address)).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Revoking", function () {
        beforeEach(async function () {
            await soulboundNFT.mint(owner.address);
        });

        it("Should revoke a token", async function () {
            await soulboundNFT.revoke(0);
            await expect(soulboundNFT.ownerOf(0)).to.be.revertedWith("ERC721: owner query for nonexistent token");
        });

        it("Should not allow revoking an already revoked token", async function () {
            await soulboundNFT.revoke(0);
            await expect(soulboundNFT.revoke(0)).to.be.revertedWith("Token already revoked");
        });
    });
});
