import Component from "@ember/component";
export default Component.extend({
	tagName: "li",
	html:null,
	didInsertElement() {
		this._super(...arguments);
		this.initPage();
	},
	initPage(){
		if(this.type == "prev"){
			this.set("html","<<")
		}else if(this.type == "next"){
			this.set("html",">>")
		}else{
			this.set("html",this.page)
		}
		if(this.type == "current"){
			$(this.element).css("color","#000")
		}
		if(this.type == "current" || this.disabled){
			$(this.element).addClass("pagination-disabled")
		}

	},
	click(){
		this.initPage();
		if(this.page != null && this.type != "current"){
			let { action } = this;
			action(this.page);
		}
		

	}

	
})