import Web3 from 'web3';
import CrowdfundingContractBuild from './Crowdfunding.json';

let selectedAccount;
let crowdfundingContract;
let isInitialised = false;

export const init = async () => {
  let provider = window.ethereum;

  // check if provider is injected == MetaMask available
  if (typeof provider !== 'undefined') {
    // connect wallet to website
    provider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        selectedAccount = accounts[0]
        console.log(`Selected account is ${selectedAccount}`);
      })
      .catch((err) => {
        console.log(err);
        return;
      });

    // on account switching
    window.ethereum.on('accountsChanged', function (accounts) {
      selectedAccount = accounts[0];
      console.log(`Selected account changed to ${selectedAccount}`);
    });
  }

  const web3 = new Web3(provider);

  const networkId = await web3.eth.net.getId();

  crowdfundingContract = new web3.eth.Contract(
    CrowdfundingContractBuild.abi, 
    CrowdfundingContractBuild.networks[networkId].address
  );

  isInitialised = true;
}

export const createNewProject = async () => {
  if (!isInitialised) {
    await init();
  }
  return crowdfundingContract.methods
    .createNewProject("title", "descr", 1000, 1)
    .send({ from: selectedAccount });
};