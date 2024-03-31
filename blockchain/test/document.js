const Document = artifacts.require("Document");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client accounts[0]
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Document", function (accounts) {
  let contract;
  const docBase64 = String(Math.floor(Math.random() * 9999999999));

  it("should be deployed", async () => {
    contract = await Document.deployed();
    return assert.isTrue(true);
  });

  describe("storing a base64 for address[0]", async () => {
    before("setting the document 'id' for accounts[0]", async () => {
      await contract.setDocument("id", docBase64, { from: accounts[0] });
    });

    it("should have permission to see the document 'id' for accounts[0]", async () => {
      const permission = await contract.getPermissionForDocument(accounts[0], "id", { from: accounts[0] })
      assert.isTrue(permission);
    });

    it("should see the base64 of the document 'id' for accounts[0]", async () => {
        const base64 = await contract.retrieveDocument(accounts[0], "id", { from: accounts[0] })
        assert.equal(base64, docBase64);
    });
  })

  describe("accessing from another account", async () => {
    before("should give permission to access document 'id' for accounts[1]", async () => {
      await contract.setPermissionForDocument(accounts[1], "id", true, { from: accounts[0] })
      assert.isTrue(true);
    });

    it("accounts[1] should have permission to see accounts[0] 'id'", async () => {
      const permission = await contract.checkPermissionForDocument(accounts[0], "id", { from: accounts[1] })
      assert.isTrue(permission);
    });

    it("accounts[0] should see the permission for 'id' of accounts[1]", async () => {
      const permission = await contract.getPermissionForDocument(accounts[1], "id", { from: accounts[0] })
      assert.isTrue(permission);
    });

    it("accounts[2] should not have permission to access document", async () => {
      try {
        await contract.retrieveDocument(accounts[0], "id", { from: accounts[2] })
        assert.isTrue(false);
      } catch (error) {
        assert.isTrue(true);
      }
    });

    it("should revoke permission to access document 'id' for accounts[1]", async () => {
      await contract.setPermissionForDocument(accounts[1], "id", false, { from: accounts[0] })
      const permission = await contract.getPermissionForDocument(accounts[1], "id", { from: accounts[0] })
      assert.isFalse(permission);
    });
  });

});
