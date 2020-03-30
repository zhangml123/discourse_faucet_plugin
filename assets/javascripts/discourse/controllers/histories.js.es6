import discourseComputed from "discourse-common/utils/decorators";
import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";
export default Ember.Controller.extend({
	faucetImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/faucet.svg"),
	actions: {
	    loadMore() {
		    this.get("model").loadMore();
		}
	}
  
})