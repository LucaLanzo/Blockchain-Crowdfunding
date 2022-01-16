pragma solidity ^0.8.11;


contract Crowdfunding {
    Project[] private allProjects; // private or public?


    /**
        description
    */
    event NewProjectStarted(
        String title, 
        String descr,
        String projectAddress,
        uint amountToRaise,
        int time
    );

    /** 
        description
    */
    function createNewProject() external {
        Project project = new Project(title, descr, amountToRaise, time);
        
        emit newProjectStarted(
            project.title, 
            project.descr, 
            project.projectAddress, 
            project.amountToRaise, 
            project.time);
    }

    /** 
        only necessary when visibility = private
    */
    function getAllProjects() external view returns(Project[] memory) {
        return projects;
    }
}


contract Project {
    enum State { RAISING, RAISED, REFUNDED }
    
    String title;
    String descr;
    
    address private creatorAddress; // to pay out
    address projectAddress; // to store
    
    State state;
    uint amountToRaise;
    uint currentBalance;
    int time;


    constructor(String _title, String _descr, uint _amountToRaise, int _time) {
        title = _title;
        descr = _descr;
        amountToRaise = _amountToRaise;
        time = _time;
        state = State.RAISING;
        creatorAddress = msg.sender;
    }

    /** 
        description
    */
    function contribute() external payable {

    }

    /** 
        description
    */
    payOut() private {
        
    }

    /** 
        description
    */
    refund() private {

    }
}
