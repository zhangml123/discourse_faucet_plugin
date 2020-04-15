import discourseComputed from "discourse-common/utils/decorators";
import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import Controller, { inject as controller } from "@ember/controller";
import discourseDebounce from "discourse/lib/debounce";
import { observes } from "discourse-common/utils/decorators";

export default Ember.Controller.extend({
	application: controller(),
	faucetImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/faucet.svg"),
	queryParams: ["period", "order", "asc", "name", "group", "exclude_usernames"],
	period: "weekly",
  	order: "created_at",
  	asc: null,
  	name: "",
  	group: null,
  	currentPage : 1,
  	exclude_usernames: null,
  	@observes("nameInput")
	_setName: discourseDebounce(function() {
		this.set("name", this.nameInput);
	}, 500),

	@observes("model.canLoadMore")
	_showFooter: function() {
		this.set("application.showFooter", !this.get("model.canLoadMore"));
	},
  
	actions: {
	    loadMore() {
		    this.get("model").loadMore();
		},
		changePage(page){
			
			console.log("history_page = "+page)
			ajax("/faucet_history_items?page=" + page).then(result => {
		    
		    	console.log("result = ")
		    	console.log(result)
		        this.set("content",result.faucet_history_items)
		    	
		    })
		   
			
		}
	}
  
})