import { ajax } from "discourse/lib/ajax";
import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({

  /*beforeModel() {
    console.log("beforeModel")
    var url = "/faucet/history_items"
    ajax({ url}).then(result => {
      this.store.createRecord("faucetHistory", result);
    });
  },*/
  model(params) {
    
    /*return ajax("/faucet/history_items").then(result => {
     const record = this.store.createRecord("history_items:", result);
    
     return record
    });
    //return this.store.peekRecord("faucetHistory")*/
    return this.store.find("faucetHistoryItem",params);
  },
  setupController(controller, model) {
    console.log("model = ")
    console.log(model)
    controller.setProperties({
      model
      
    });
  }

  
});
