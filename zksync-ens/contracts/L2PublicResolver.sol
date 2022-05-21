//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/Multicallable.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/ABIResolver.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/AddrResolver.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/ContentHashResolver.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/InterfaceResolver.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/NameResolver.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/PubkeyResolver.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/TextResolver.sol";

contract L2PublicResolver is
    Multicallable,
    ABIResolver,
    AddrResolver,
    ContentHashResolver,
    InterfaceResolver,
    NameResolver,
    PubkeyResolver,
    TextResolver
{
    ENS immutable ens;

    /**
     * A mapping of operators. An address that is authorised for an address
     * may make any changes to the name that the owner could, but may not update
     * the set of authorisations.
     * (owner, operator) => approved
     */
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Logged when an operator is added or removed.
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    constructor(ENS _ens) {
        ens = _ens;
    }

    /**
     * @dev See {IERC1155-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) external {
        require(
            msg.sender != operator,
            "ERC1155: setting approval status for self"
        );

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * @dev See {IERC1155-isApprovedForAll}.
     */
    function isApprovedForAll(address account, address operator)
        public
        view
        returns (bool)
    {
        return _operatorApprovals[account][operator];
    }

    function isAuthorised(bytes32 node) internal view override returns (bool) {
        address owner = ens.owner(node);
        return owner == msg.sender || isApprovedForAll(owner, msg.sender);
    }

    function supportsInterface(bytes4 interfaceID)
        public
        pure
        override(
            Multicallable,
            ABIResolver,
            AddrResolver,
            ContentHashResolver,
            InterfaceResolver,
            NameResolver,
            PubkeyResolver,
            TextResolver
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceID);
    }
}
