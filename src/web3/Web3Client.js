import Web3 from 'web3';
import CrowdfundingContractBuild from 'buildcontractsfolder/Crowdfunding.json'
import ProjectContractBuild from 'buildcontractsfolder/Project.json'


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
        isInitialised = false;
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


/*
 * Once subscribed, creates a new project with the given data
 */
export const createNewProject = async (title, descr, goal, deadline) => {
  console.log(!isInitialised);
  if (!isInitialised) {
    await init();
    return;
  }
  
  if (crowdfundingContract == null) {
    await init();
    return;
  }

  crowdfundingContract.methods
    .createNewProject(title, descr, goal, deadline)
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
  
  if (projectAddresses !== null && projectAddresses.length > 0) {
    for (var i = 0; i < projectAddresses.length; i++) {
      projectContracts.push(new web3.eth.Contract(ProjectContractBuild.abi, projectAddresses[i]));
    }
  }

  return projectContracts;
}


export const getSingleProjectContract = async (projectAddress) => {
  return new web3.eth.Contract(ProjectContractBuild.abi, projectAddress);
}


/*
 * once subscribed, returns list of all project views
 */
export const getAllProjectViews = async (projectContracts) => {
  let projectViews = [];

  if (projectContracts !== null  && projectContracts.length > 0) {
    for (var i = 0; i < projectContracts.length; i++) {
      projectViews.push(await projectContracts[i].methods.viewProject().call())
    }
  }
  
  return projectViews;
}


export const fund = async (projectContract, fundingAmount) => {
  projectContract.methods
  .fund()
  .send({
    from: selectedAccount,
    value: fundingAmount
  })
  .then((res) => {
    const newFundingEvent = res.events.NewFunding.returnValues;
    // promise
    return newFundingEvent;
  });
}

export const payout = async (projectContract) => {
  projectContract.methods
  .payOut()
  .send({
    from: selectedAccount
  })
  .then((res) => {
    const payOutEvent = res.events.ProjectPaidOut.returnValues;
    // promise
    return payOutEvent;
  });
}

export const refund = async (projectContract) => {
  projectContract.methods
  .refund()
  .send({
    from: selectedAccount
  })
  .then(() => {});
}

export const checkIfProjectEnded = async (projectContract) => {
  return projectContract.methods.checkIfProjectEnded().send({
    from: selectedAccount
  });
}
