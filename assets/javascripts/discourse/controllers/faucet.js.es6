import discourseComputed from "discourse-common/utils/decorators";
export default Ember.Controller.extend({
	addressAvailable: false,
	exceeded: false,
	@discourseComputed(
      "addressAvailable",
      "exceeded"
    )
	receiveDisabledn() {
		console.log("receiveDisabled " )
		if(!this.addressAvailable) return true;
		if(this.exceeded) return true;
		return false;
	},
	
	actions: {
		onInputChange(){
			console.log("onInputChange")
			this.addressAvailable = !this.addressAvailable
			console.log(this.addressAvailable)
		}
	}

  
})