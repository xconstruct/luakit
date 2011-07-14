local print = print
local webview = webview
local capi = { luakit = luakit }

module("webscroll")

local webscroll_js = [=[
	if (document.getElementById('-webscroll') == null) {

		// Create Webscroll widget
		var webscroll = document.createElement("div");
		document.body.appendChild(webscroll);

		webscroll.setAttribute('id', '-webscroll');
		webscroll.innerHTML = '0%';
		webscroll.style.font = 'italic 12px serif';
		webscroll.style.zIndex = 100;
		webscroll.style.position = 'fixed';
		webscroll.style.bottom = '10px';
		webscroll.style.right = '10px';
		webscroll.style.padding = '5px';
		webscroll.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
		webscroll.style.border = '1px solid rgba(0, 0, 0, 0.4)';
		webscroll.style.borderRadius = '15px';
		webscroll.style.textShadow = '#000 1px 1px 2px';

		webscroll.update = function(val, max) {
			if (max == 0) val = "All"
			else if (val == 0) val = "Top"
			else if (val == max) val = "Bot"
			else val = (val/max*100).toFixed() + '%'
			
			webscroll.innerHTML = val
		}
	}
]=]

webview.init_funcs.webscroll = function(view, w)
	view:add_signal("load-status", function(v, status)
		if status == "first-visual" or status == "finished" then -- finished
			view:eval_js(webscroll_js, "(webscroll:load)")
		end
	end)

	view:add_signal("expose", function(v)
		local val, max = view:get_scroll_vert()
		view:eval_js("if (typeof webscroll != 'undefined') webscroll.update(" .. val .. "," .. max .. ");", "(webscroll:update)")
	end)
end
