const { ethers } = require("hardhat");

async function deploySoulboundNFT() {
    const SoulboundNFT = await ethers.getContractFactory("SoulboundNFT");
    const soulboundNFT = await SoulboundNFT.deploy(); // Развёртывание контракта

    console.log("SoulboundNFT deployed to:", await soulboundNFT.getAddress());
    return soulboundNFT;
}

module.exports = { deploySoulboundNFT };

// Если нужно, вы можете также вызвать функцию прямо из этого файла
if (require.main === module) {
    deploySoulboundNFT()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
