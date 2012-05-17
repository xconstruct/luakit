local chrome = require("chrome")
require("webview")

local dir = luakit.config_dir.."/start"
local start_page = "file://"..dir.."/index.html"

webview.init_funcs.chrome_start = function(view, w)
	view:add_signal("load-status", function(v, status)
		if view.uri == start_page and status == "finished" then
			view.enable_universal_access_from_file_uris = true;
		end
	end)
end
