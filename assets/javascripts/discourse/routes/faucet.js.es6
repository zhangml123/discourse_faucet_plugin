import { ajax } from "discourse/lib/ajax";
import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  model() {
    return ajax("/faucet/get-balance").then(result => {
      console.log("result = ")
      console.log(result)
      if(result.status){
          const balance  =  ( result.balance / 1000000000000000000 ).toFixed(2)
          return {"balance": balance }
      }else{
        return {"balance": false }
      }
     
    });
  }

  
});
