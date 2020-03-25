import { ajax } from "discourse/lib/ajax";
import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  model() {
    return ajax("/faucet/get-balance").then(result => {
      console.log("result = ")
      console.log(result)
      return result;
    });
  }

  
});
