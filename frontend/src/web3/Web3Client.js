import Web3 from 'web3';
import CrowdfundingContractBuild from './abis/Crowdfunding.json'
import ProjectContractBuild from './abis/Project.json'


export let selectedAccount;
export let crowdfundingContract;
let web3;
let networkId;
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

  web3 = new Web3(provider);

  networkId = await web3.eth.net.getId();

  crowdfundingContract = new web3.eth.Contract(
    CrowdfundingContractBuild.abi,
    CrowdfundingContractBuild.networks[networkId].address
  );

  isInitialised = true;
}


// async function getCrowdfundingContract() {
//   if (!isInitialised) {
//     await init();
//   }
  
//   crowdfundingContract = new web3.eth.Contract(
//     CrowdfundingContractBuild.abi,
//     CrowdfundingContractBuild.network[networkId].address
//   );
// }



/*
 * Once subscribed, creates a new project with the given data
 */
export const createNewProject = async (title, descr, goal, deadline) => {
  if (!isInitialised) {
    await init();
  }
  
  crowdfundingContract.methods
    .createNewProject(title, descr, web3.utils.toWei(goal, 'ether'), deadline)
    .send({
      from: selectedAccount
    })
    .then((res) => {
      const newProjectEvent = res.events.NewProjectStarted.returnValues;
      // promise
      return newProjectEvent;
    });
}

/*
 * once subscribed, returns list of all project contract addresses
 */
export const getAllProjectAddresses = async () => {
  if (!isInitialised) {
    await init();
  }
  
  return crowdfundingContract.methods.viewAllProjects().call();
}

/*
 * once subscribed, returns list of all project contracts
 */
export const getAllProjectContracts = async (projectAddresses) => {
  let projectContracts = []

  for (var i = 0; i < projectAddresses.length; i++) {
    projectContracts.push(new web3.eth.Contract(ProjectContractBuild.abi, projectAddresses[i]));
  }

  return projectContracts;
}


export const getProjectView = async (projectContract) => {
  return projectContract.methods.viewProject().call()
}


// projectContract.methods.viewProject().call().then((details) => {
//  const projectView = details;

//  console.log(projectView);

//  projectView.projectAddress = address;

//  projectContractsView.push(projectView);
//     });





