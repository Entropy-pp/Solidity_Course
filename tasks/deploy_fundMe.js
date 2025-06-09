const {task} = require("hardhat/config");

task("depoly_fundMe").setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("Deploying FundMe contract...")
    
    // deploy contract
    const fundMe = await fundMeFactory.deploy(3000)
    
    console.log("Waiting for 5 block...")
    console.log(`FundMe deployed to: ${fundMe.target}`)
    
    // wait for deployment
    if(hre.network.config.chainId === 11155111 && process.env.APIKEY){
        const txResponse = await fundMe.deploymentTransaction()
        await txResponse.wait(5)  
        await verifyContract(fundMe.target, 3000)
    }else{
        console.log("Skipping contract verification")
    }
})

async function verifyContract(fundMe, args) {
    await hre.run("verify:verify", {
        address: fundMe,
        constructorArguments: [args],
    });
}