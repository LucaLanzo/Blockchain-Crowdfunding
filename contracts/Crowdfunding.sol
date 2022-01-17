pragma solidity ^0.8.11;


contract Crowdfunding {
    Project[] private allProjects;


    /**
        description
    */
    event NewProjectStarted(
        string title, 
        string descr,
        address projectAddress,
        address creator,
        uint amountToRaise,
        uint deadline
    );

    /** 
        description
    */
    function createNewProject(string calldata _title, string calldata _descr, uint _amountToRaise, uint _numberOfDaysUntilDeadline) external {
        uint deadline = block.timestamp + (_numberOfDaysUntilDeadline * 1 days);
                
        Project project = new Project(_title, _descr, _amountToRaise, deadline);
        allProjects.push(project);

        emit NewProjectStarted(
            _title, 
            _descr,
            address(project),
            msg.sender, 
            _amountToRaise, 
            deadline);
    }

    /** 
        only necessary when visibility = private
    */
    function viewAllProjects() external view returns(Project[] memory) {
        return allProjects;
    }
}


contract Project {
    enum ProjectState { RAISING, RAISED, EXPIRED, REFUNDED }
    
    string public title;
    string public descr;
    
    address payable public creator; // to pay out
    
    ProjectState state;
    uint public amountToRaise;
    uint256 public currentBalance;
    uint public deadline;
    uint public completedAt;

    mapping (address => uint) public fundings;

    /**
        description
    */
    event NewFunding(address sender, uint amount, uint currentBalance);

    /**
    
    */
    event ProjectRaised(address creator, uint256 currentBalance);

    modifier inProjectState(ProjectState _state) {
        require(state == _state);
        _;
    }

    constructor(string memory _title, string memory _descr, uint _amountToRaise, uint _deadline) {
        title = _title;
        descr = _descr;
        amountToRaise = _amountToRaise;
        currentBalance = 0;
        deadline = _deadline;
        state = ProjectState.RAISING;
        creator = payable(msg.sender);
    }

    /** 
        description
        The first line is very important. Imagine if the project is close to finish and the goal hasn't been quite met yet, the creator could
        just send the remaining amount and close the project himself. This is like artificially inflating the raised amount which is no bueno.
    */
    function fund() external inProjectState(ProjectState.RAISING) payable {
        require(msg.sender != creator);

        fundings[msg.sender] = msg.value;

        currentBalance += msg.value;

        emit NewFunding(msg.sender, msg.value, currentBalance);

        checkForPayOut();
    }

    /**

    */
    function checkForPayOut() public {
        if (currentBalance >= amountToRaise) {
            state = ProjectState.RAISED;
            payOut();
        } else if (block.timestamp > deadline) {
            state = ProjectState.EXPIRED;
        }
        completedAt = block.timestamp;
    }

    /** 
        description
    */
    function payOut() internal inProjectState(ProjectState.RAISED) returns (bool) {
       	uint256 _currentBalance = currentBalance;
        currentBalance = 0;

        if (creator.send(_currentBalance)) {
            emit ProjectRaised(creator, _currentBalance);
            return true;
        } else {
            // revert
            currentBalance = _currentBalance;
            state = ProjectState.RAISED;
        }
        return false;
    }

    /** 
        description
    */
    function refund() public inProjectState(ProjectState.EXPIRED) returns (bool) {
        // check if sender has even funded the project
        require(fundings[msg.sender] > 0);

        uint _amountToRefund = fundings[msg.sender];
        fundings[msg.sender] = 0;

        if (payable(msg.sender).send(_amountToRefund)) {
            currentBalance -= _amountToRefund;
        } else {
            // revert
            fundings[msg.sender] = _amountToRefund;
            return false;
        }
        return true;
    }

    /**
        get total contributions view
    */
    function viewTotalContributions() view public returns(uint256 _viewcurrentBalance) {
        _viewcurrentBalance = currentBalance;
    }

    /**
    
    */
    function viewProject() external view returns(
        string memory _viewtitle,
        string memory _viewdescr,
        address _viewcreator,
        ProjectState _viewstate,
        uint _viewamountToRaise,
        uint256 _viewcurrentBalance,
        uint _viewdeadline
    ) {
        _viewtitle = title;
        _viewdescr = descr;
        _viewcreator = creator;
        _viewstate = state;
        _viewamountToRaise = amountToRaise;
        _viewcurrentBalance = currentBalance;
        _viewdeadline = deadline;
    }
}
