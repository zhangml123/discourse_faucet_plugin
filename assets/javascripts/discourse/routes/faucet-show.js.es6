import { ajax } from "discourse/lib/ajax";
import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  
  model() {
    return ajax("/faucet/get-balance").then(result => {
      console.log("result = ")
      console.log(result)
      
      if(result.status){
          const balance  =  Math.floor(result.balance / 10000000000000000) / 100  
          console.log(Math.floor(result.balance / 10000000000000000))
          console.log(balance)
          const amount = (result.amount).toFixed(2) 
          const claimed = result.claimed ? result.claimed[0] : null;
          if(claimed){
            switch(claimed.status){
              case "claimed" : 
                claimed.style = "background:#70b603;width:20%";
                claimed.t_status = "faucet.status.claimed";
                break;
              case "pending" : 
                claimed.style = "background:#F59A23;width:50%";
                claimed.t_status = "faucet.status.pending";
                break;
              case "success" : 
                claimed.style = "background:#70b603;width:100%";
                claimed.t_status = "faucet.status.success";
                break;
              case "failed" : 
                claimed.style = "background:#999;width:100%";
                claimed.t_status = "faucet.status.failed";
                break;
            }
          }
          const user_limit = Discourse.SiteSettings.faucet_user_limit;
          const faucet_open = Discourse.SiteSettings.faucet_open;
          var serviceStatus = "faucet.server.running";
          var serviceStatusStyle ="background-color:#70b603"
          if(amount < user_limit) {
            serviceStatus = "faucet.server.suspend";
            serviceStatusStyle ="background-color:#F59A23"
          }
          if(balance < user_limit) {
            serviceStatus = "faucet.server.down";
            serviceStatusStyle ="background-color:#ff0000"
          }
          if(!faucet_open){
            console.log("faucet closed")
            serviceStatus = "faucet.server.suspend";
            serviceStatusStyle ="background-color:#F59A23" 
          }
          return {"balance": balance, "amount": amount, "claimed":claimed, "status":result.status ,"serviceStatus": serviceStatus, "serviceStatusStyle":serviceStatusStyle}
      }else{
        return {"balance": "...", "amount": "...", "status": false , "serviceStatus":"faucet.server.down", "serviceStatusStyle":"background-color:#ff0000fa"}
      }
     
    });
  },
  setupController(controller, model) {
    controller.setProperties({
      model,
      balance: model.balance,
      amount: model.amount,
      claimed:( model.claimed ? true : false),
      t_status: ( model.claimed ? model.claimed.t_status : null),
      claimed_style: ( model.claimed ? model.claimed.style : null),
      t_address: ( model.claimed ? model.claimed.address : null),
      serviceStatus: model.serviceStatus,
      faucetInfoBorderRadius: ( model.claimed ? "border-bottom-left-radius:unset;border-bottom-right-radius:unset;border-bottom:none":""),
    });
    
  }
});
