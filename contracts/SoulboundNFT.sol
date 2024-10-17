    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.26;

    import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";

    contract SoulboundNFT is ERC721Enumerable, Ownable {
        uint256 private _tokenIdCounter; // Счетчик токенов
        mapping(uint256 => bool) private _revoked; // Словарь для отслеживания отозванных токенов

        struct NFTMetadata {
            string name;
            string surname;
            string workplace;
            string imageUrl;
        }

        mapping(uint256 => NFTMetadata) private _tokenMetadata; // Маппинг для хранения метаданных токенов

        // Передаем msg.sender как первоначального владельца в конструктор Ownable
        constructor() ERC721("SoulboundNFT", "SBNFT") Ownable(msg.sender) {}

        function getOwner() external view returns (address) {
            return owner();
        }

        // Функция для выпуска NFT
        function mint(address to, string memory name, string memory surname, string memory workplace, string memory imageUrl) external onlyOwner {
            uint256 tokenId = _tokenIdCounter++;
            _mint(to, tokenId);

            // Сохраняем метаданные токена
            _tokenMetadata[tokenId] = NFTMetadata(name, surname, workplace, imageUrl);

        }

        // Переопределяем функцию transferOwnership из Ownable
        function transferOwnership(address newOwner) public override onlyOwner {
            require(newOwner != address(0), "New owner is the zero address");
            super.transferOwnership(newOwner);
        }

        // Функция для отзыва NFT
        function revoke(uint256 tokenId) external onlyOwner {
            require(ownerOf(tokenId) != address(0), "ERC721: owner query for nonexistent token");
            require(!_revoked[tokenId], "Token already revoked");

            _revoked[tokenId] = true; // Устанавливаем флаг отзыва
            _burn(tokenId); // Отзываем токен
        }

        // Функция для проверки существования токена
        function exists(uint256 tokenId) public view returns (bool) {
            return ownerOf(tokenId) != address(0);
        }

        // Функция для получения метаданных токена
        function getTokenMetadata(uint256 tokenId) external view returns (NFTMetadata memory) {
            require(exists(tokenId), "Query for nonexistent token");
            return _tokenMetadata[tokenId];

        }

    }
