import discourseComputed from "discourse-common/utils/decorators";
import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import { isEmpty } from "@ember/utils";
import { observes, on } from "discourse-common/utils/decorators";
export default Ember.Controller.extend({
	addressLimitValidation: null,
	checkedAddress:false,
	exceeded: false,
	daily_limit : Discourse.SiteSettings.faucet_daily_limit,
	user_limit : Discourse.SiteSettings.faucet_user_limit,
	level_limit : Discourse.SiteSettings.faucet_level_limit_set,
	faucet_open: Discourse.SiteSettings.faucet_open,
	address : "",
	submited:false,
	loading:false,
	faucetImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/faucet.svg"),
	balanceImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/balance.svg"),
	availableImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/available.svg"),
	statusbleImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/status.svg"),
	claim_tip:null,
	interval:null,
	@discourseComputed(
      "isExceeded.failed",
      "isBalance.failed",
      "addressValidation.failed",
      "addressLimitValidation.failed",
      "submited"
    )
	receiveDisabled() {
		if(!this.faucet_open) return true;
		if(!this.get("model").status) return true;
		if(!this.currentUser) return false;
		if(this.get("addressValidation.failed")) return true;
		if(this.get("addressLimitValidation.failed")) return true;
		if(this.get("isExceeded.failed")) return true;
		if(this.get("isBalance.failed")) return true;
		if(this.submited) return true;
		return false;
	},
	@discourseComputed("address")
	addressBaseValidation() {
		this.addressLimitValidation = null;
		console.log("addressBaseValidation")
		var address = this.address;
		
		if(this.currentUser && this.currentUser.trust_level < this.level_limit){
			return EmberObject.create({
		        failed: true,
		        reason: I18n.t("faucet.user.level_limit")////用户等级不足
		    });
		}
		if (this.claimed){
			return EmberObject.create({
		        failed: true,
		        reason: I18n.t("faucet.user.user_limit")////今日已领取
		    });
		}
		if(this.get("model").balance < this.user_limit) {
			return EmberObject.create({
		        failed: true,
		        reason: I18n.t("faucet.balance.invalid")////水龙头余额不足
		    });
		}
	    if(this.get("model").amount < this.user_limit) {
			return EmberObject.create({
		        failed: true,
		        reason: I18n.t("faucet.amount.invalid")////今日领取余额不足
		    });
		}
		
		if (isEmpty(address)) {
	        return EmberObject.create({
	          failed: true
	        });
	     }
		if(address != "" && (((address.length == "42") && (address.substring(0,2) == "0x")) || ((address.length == "40") && (address.substring(0,2) != "0x")))){
			this.set("loading", true);
	    	if((address.length == "40") && (address.substring(0,2) != "0x")) address = "0x" + address
	    	ajax("/faucet/check_address?address=" + address)
			  .then(result => {
			  	this.set("loading", false);
			  	console.log("check_address")
			 if(result.claimed){
			 	console.log(result.claimed)
			 	this.set( "addressLimitValidation",EmberObject.create({
			        failed: true,
			        reason: I18n.t("faucet.address.limit")
			    }) );
			 	
			 }else{
			 	console.log(result.claimed)
			 	this.set( "addressLimitValidation",EmberObject.create({
			        ok: true,
			        reason: I18n.t("faucet.address.ok")
			    }));
			 	
			 }
		    });
			return EmberObject.create({
		        failed: true
		    });
		}else{
			return EmberObject.create({
		        failed: true,
		        reason: I18n.t("faucet.address.invalid")////地址错误
		    });
		}
		
	},
	@discourseComputed("addressBaseValidation","addressLimitValidation","claim_tip")
	addressValidation(){
		if(this.claim_tip) return this.claim_tip;
 		return this.addressLimitValidation ? this.addressLimitValidation : this.addressBaseValidation;
	},
	@on("init")
	autoRrefresh(){
		console.log("init")
		
		clearInterval(this.interval)
		let interval = setInterval(function(){

			this.set("daily_limit", Discourse.SiteSettings.faucet_daily_limit)
		  	this.set("user_limit", Discourse.SiteSettings.faucet_user_limit)
		  	this.set("level_limit",  Discourse.SiteSettings.faucet_level_limit_set)
		  	this.set("faucet_open", Discourse.SiteSettings.faucet_open)
		},5000) 
		this.set("interval",interval)
		this.messageBus.unsubscribe("/faucet/claimed");
		this.messageBus.subscribe(
	      `/faucet/claimed`,
     	data => {
      	  console.log(data)
      	  const balance =  Math.floor(data.balance / 10000000000000000) / 100
      	  const amount = data.amount
		  this.set("balance", balance)
		  this.set("amount", amount)
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
		  this.set("serviceStatus", serviceStatus)
          this.set("serviceStatusStyle", serviceStatusStyle)
        })


	},
	willDestroy() {
    this._super(...arguments);

      alert("willDestroy")
      console.log("willDestroy")
    },
	actions: {
		claim(){
			
			if(!this.faucet_open) return false;
			this.set("submited", true);
		  	if(!this.get("model").status) return false;
			if(!this.currentUser){
				this.set("loading", false);
				this.send("showLogin");
			}else{

				this.set("claimed", true);
				this.set("t_address", this.address);
				this.set("t_status", "faucet.status.pending");
				this.set("claimed_style", "background:#F59A23;width:0px");
				let _this = this;
				setTimeout(function(){
					_this.set("claimed_style", "background:#F59A23;width:50%")
				},1000)
				this.set("faucetInfoBorderRadius","border-bottom-left-radius:unset;border-bottom-right-radius:unset;border-bottom:none")
				var address = this.address
				if((address.length == "40") && (address.substring(0,2) != "0x")) address = "0x" + address
				ajax("/faucet/claim",{
					type: "POST",
					data: {address : address}
				}).then(result => {
					console.log(result)
				  	this.set("loading", false);
				  	
				  	if(result.success) {
				  		this.set("claim_tip",EmberObject.create({
					        ok: true,
					        reason: result.message
					    }))
				  		const balance  =  Math.floor(result.balance.balance / 10000000000000000) / 100 
				  		this.set("balance",balance)
				  		this.set("amount",result.balance.amount)
						this.set("t_status", "faucet.status.success");
						this.set("claimed_style", "background:#70b603;width:100%");
				  	}else{
				  		this.set("t_status", "faucet.status.failed");
						this.set("claimed_style", "background:#999;width:100%");
						this.set("claim_tip",EmberObject.create({
					        failed: true,
					        reason: result.message
					    }))
				  	}
			    });
			}
		}
	}
})