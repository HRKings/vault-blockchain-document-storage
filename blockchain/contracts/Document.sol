// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Document {
    mapping(address => string) private _aliasMap;

    mapping(address => mapping(string => string)) private _documents;
    mapping(address => mapping(string => mapping(address => bool))) private _permissions;

    // Set an alias for the address
    function setName(string calldata name) public {
        bytes memory documentNameBytes = bytes(name);
        require(documentNameBytes.length != 0, "Must provide a name");

        _aliasMap[msg.sender] = name;
    }

    // Get the alias for an address
    function getName(address owner) public view returns(string memory) {
        require(owner != address(0), "ERC20: transfer from the zero address");

        return _aliasMap[owner];
    }

    // Used to store the bas64 of an document of the sender
    function setDocument(string calldata documentName, string calldata bas64Document) public returns (address) {
        bytes memory documentNameBytes = bytes(documentName);
        require(documentNameBytes.length != 0, "Must provide a document name");
        bytes memory documentHashBytes = bytes(bas64Document);
        require(documentHashBytes.length != 0, "Must provide a document hash");

        _permissions[msg.sender][documentName][msg.sender] = true;
        _documents[msg.sender][documentName] = bas64Document;
        return address(this);
    }

    // Used by the sender to get a document from the owner
    function retrieveDocument(address owner, string calldata documentName) public view returns (string memory)
    {
        bytes memory documentNameBytes = bytes(documentName);
        require(documentNameBytes.length != 0, "Must provide a document name");
        require(owner != address(0), "ERC20: transfer from the zero address");
        require(_permissions[owner][documentName][msg.sender]);

        return _documents[owner][documentName];
    }

    // Used by the sender to set a permission for a document for an address
    function setPermissionForDocument(address requestant, string calldata documentName, bool permission) public {
        bytes memory documentNameBytes = bytes(documentName);
        require(documentNameBytes.length != 0, "Must provide a document name");
        require(requestant != address(0), "ERC20: transfer from the zero address");

        _permissions[msg.sender][documentName][requestant] = permission;
    }

    // Used by the sender to see if an address has permission to see a document
    function getPermissionForDocument(address requestant, string calldata documentName) public view returns (bool) {
        bytes memory documentNameBytes = bytes(documentName);
        require(documentNameBytes.length != 0, "Must provide a document name");
        require(requestant != address(0), "ERC20: transfer from the zero address");

        return _permissions[msg.sender][documentName][requestant];
    }

    // Check to see if the sender has permission to see a document
    function checkPermissionForDocument(address owner, string calldata documentName) public view returns (bool) {
        bytes memory documentNameBytes = bytes(documentName);
        require(documentNameBytes.length != 0, "Must provide a document name");
        require(owner != address(0), "ERC20: transfer from the zero address");

        return _permissions[owner][documentName][msg.sender];
    }
}
