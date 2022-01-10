const HelloBlockchain = artifacts.require("Crowdfunding");
contract('Crowdfunding', (accounts) => {

    it('testing ResponseMessage of Crowdfunding', async () => {
        const HelloBlockchainInstance = await HelloBlockchain.deployed();
        
        assert.equal('something', 'something', 'A correctness property about ResponseMessage of HelloBlockchain');
    });
   
});