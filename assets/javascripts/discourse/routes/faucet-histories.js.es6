import { ajax } from "discourse/lib/ajax";
import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  queryParams: {
    period: { refreshModel: true },
    order: { refreshModel: true },
    asc: { refreshModel: true },
    name: { refreshModel: true, replace: true },
    group: { refreshModel: true },
    exclude_usernames: { refreshModel: true }
  },
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.setProperties({
        period: "weekly",
        order: "likes_received",
        asc: null,
        name: "",
        group: null,
        exclude_usernames: null
      });
    }
  },
  model(params) {
    this._params = params;
    return this.store.find("faucetHistoryItem",params);
  },
  setupController(controller, model) {
    console.log("model = ")
    console.log(model)
    const params = this._params;
    controller.setProperties({
      model,
      period: params.period,
      nameInput: params.name
      
    });
  },
  actions: {
    didTransition() {
      this.controllerFor("users")._showFooter();
      return true;
    }
  }

  
});
