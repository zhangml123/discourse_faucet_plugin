import { withPluginApi } from "discourse/lib/plugin-api";
import { queryRegistry } from "discourse/widgets/widget";
import { h } from "virtual-dom";
console.log("loading plugin")
function initialize(api) {
	api.reopenWidget("menu-links",{


	 /* faucetLinks(){
	  	const links_faucet = [];
	  	links_faucet.push({
	        route: "faucet",
	        className: "faucet-link",
	        label: "faucet.links.title"
	      });
	  	return links_faucet.map(l => this.attach("link", l));

	  },*/

	  faucetLinks(){
	  	const links_faucet = {
	        route: "faucet",
	        className: "faucet-link",
	        label: "faucet.links.title"
	      };
	  	return this.attach("link", links_faucet);
	  },
	  html(attrs) {
	  	
	   // const links = attrs.name == "general-links" ? [attrs.contents()].concat((() => this.faucetLinks())()) : [].concat(attrs.contents());
	    const links = [].concat(attrs.contents());
	    if (attrs.name == "general-links"){
	    	links.push((() => this.faucetLinks())())
	    }
	    const liOpts = {};

	    if (attrs.heading) {
	      liOpts.className = "header";
	    }

	    const result = [];
	    result.push(
	      h(
	        "ul.menu-links.columned",
	        links.map(l => h("li", liOpts, l))
	      )
	    );

	    result.push(h("div.clearfix"));
	    if (!attrs.omitRule) {
	      result.push(h("hr"));
	    }
	    return result;
	  }
	})
/*	api.decorateWidget("menu-links", helper => {

		console.log(helper)
		if(helper.attrs.name == "general-links"){

			return helper.h("li",h("a",{className:"widget-link badge-link",href:"/faucet",title:"水龙头"},h("span.d-label","水龙头")))
    

		}
      });
*/
}


export default {
  name: "discourse_faucet_plugin",
  initialize() {
    withPluginApi("0.8.7", initialize);
  }
};
