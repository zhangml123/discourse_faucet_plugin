import { withPluginApi } from "discourse/lib/plugin-api";
import { queryRegistry } from "discourse/widgets/widget";
import { h } from "virtual-dom";
console.log("loading plugin")
function initialize(api) {
	api.reopenWidget("menu-links",{
	  html(attrs) {
	  	const links_faucet = [];
	  	links_faucet.push({
	        route: "/faucet",
	        className: "faucet-link",
	        label: "faucet.index.title"
	      });
	  	links_faucet.map(l => this.attach("link", l));

	  	console.log("links_faucet =")
	  	console.log(links_faucet)
	    const links = [].concat(attrs.contents());
	    links.concat(links_faucet)

	    console.log("links = ")
	    console.log(links)
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
