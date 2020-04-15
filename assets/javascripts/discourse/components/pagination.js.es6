import Component from "@ember/component";
export default Component.extend({

	prev:null,
	next:2,
	pages:[],
	prevEllipsis:null,
	nextEllipsis:null,
	showStart:true,
	showLast:true,
	pagesNum:5,
	initPage(){
		console.log("this.currentPage")
		console.log(this.currentPage)
		console.log("this.totalPages")
		console.log(this.totalPages)
		let currentPage = this.currentPage;
		let totalPages = this.totalPages;
		let pages = []
		if(currentPage - 3 > 0) {
			this.set("showStart",true)
		}else{
			this.set("showStart",false)
		};
		if(currentPage - 2 > 0) {
			pages.push({"page":currentPage - 2,"type":""})
		}
		if(currentPage - 1 > 0) {
			this.set("prev",currentPage - 1)
			pages.push({"page":currentPage - 1,"type":""})
		}else{
			this.set("prev",null)
		};
		pages.push({"page":currentPage,"type":"current"});
		if(currentPage + 1 < totalPages) {
			this.set("next",currentPage + 1)
			pages.push({"page":currentPage + 1,"type":""})
		}else{
			this.set("next",null)
		};
		if(currentPage + 2 < totalPages) {
			pages.push({"page":currentPage + 2,"type":""})
			this.set("showLast",true)
		}else{
			this.set("showLast",false)
		};
		this.set("pages",pages);

	},
	didInsertElement() {
		this._super(...arguments);
		this.initPage();
		
	},
	actions: {
		changePage(page){
			console.log("pagination component action chagePage")
			this.set("currentPage",page)
			this.action(page);
			this.initPage()
		}
	}
	
})