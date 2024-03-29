// ==UserScript==
// @name 			12306.CN 订票助手 For Firefox&Chrome
// @namespace		http://www.u-tide.com/fish/
// @author			iFish@FishLee.net <ifish@fishlee.net> http://www.fishlle.net/
// @developer		iFish
// @contributor		
// @description		帮你订票的小助手 :-)
// @match			http://dynamic.12306.cn/otsweb/*
// @match			https://dynamic.12306.cn/otsweb/*
// @match			https://www.12306.cn/otsweb/*
// @require			http://lib.sinaapp.com/js/jquery/1.8.3/jquery.min.js
// @icon			http://www.12306.cn/mormhweb/images/favicon.ico
// @run-at			document-idle
// @version 		3.8.0
// @updateURL		http://www.fishlee.net/Service/Download.ashx/44/47/12306_ticket_helper.user.js
// @supportURL		http://www.fishlee.net/soft/44/
// @homepage		http://www.fishlee.net/soft/44/
// @contributionURL	https://me.alipay.com/imfish
// @contributionAmount	￥5.00
// ==/UserScript==

var version = "3.8.0";
var updates = [
	//"<span style='color:blue;font-weight:bold;'>新增在查询页面全自动提交订单的功能</span>",
	"改进站点过滤，修正部分情况下未能过滤的BUG（不可预订车次），可以发到站分开过滤",
	"修正在自动预定列表和黑名单中存在“|”符号时，保存后会被替换为换行的BUG",
	"支付页面增加获得在IE中打开的代码（感谢xphelper提交的代码）",
	"其它部分细节修改"
];

var faqUrl = "http://www.fishlee.net/soft/44/faq.html";
//标记
var utility_emabed = false;


//#region -----------------UI界面--------------------------

function initUIDisplay() {
	injectStyle();
}

/**
 * 将使用的样式加入到当前页面中
 */
function injectStyle() {
	var s = document.createElement("style");
	s.id = "12306_ticket_helper";
	s.type = "text/css";
	s.textContent = ".fish_running, .fish_clock, .fish_error, .fish_ok {\
	line-height:20px;\
	text-indent:18px;\
	background-repeat:no-repeat;\
	background-position:2px 50%;\
	font-size:12px;\
	}\
	.fish_running{background-image:url(data:image/gif;base64,R0lGODlhEAAQALMPAHp6evf394qKiry8vJOTk83NzYKCgubm5t7e3qysrMXFxe7u7pubm7S0tKOjo////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCAAPACwAAAAAEAAQAAAETPDJSau9NRDAgWxDYGmdZADCkQnlU7CCOA3oNgXsQG2FRhUAAoWDIU6MGeSDR0m4ghRa7JjIUXCogqQzpRxYhi2HILsOGuJxGcNuTyIAIfkECQgADwAsAAAAABAAEAAABGLwSXmMmjhLAQjSWDAYQHmAz8GVQPIESxZwggIYS0AIATYAvAdh8OIQJwRAQbJkdjAlUCA6KfU0VEmyGWgWnpNfcEAoAo6SmWtBUtCuk9gjwQKeQAeWYQAHIZICKBoKBncTEQAh+QQJCAAPACwAAAAAEAAQAAAEWvDJORejGCtQsgwDAQAGGWSHMK7jgAWq0CGj0VEDIJxPnvAU0a13eAQKrsnI81gqAZ6AUzIonA7JRwFAyAQSgCQsjCmUAIhjDEhlrQTFV+lMGLApWwUzw1jsIwAh+QQJCAAPACwAAAAAEAAQAAAETvDJSau9L4QaBgEAMWgEQh0CqALCZ0pBKhRSkYLvM7Ab/OGThoE2+QExyAdiuexhVglKwdCgqKKTGGBgBc00Np7VcVsJDpVo5ydyJt/wCAAh+QQJCAAPACwAAAAAEAAQAAAEWvDJSau9OAwCABnBtQhdCQjHlQhFWJBCOKWPLAXk8KQIkCwWBcAgMDw4Q5CkgOwohCVCYTIwdAgPolVhWSQAiN1jcLLVQrQbrBV4EcySA8l0Alo0yA8cw+9TIgAh+QQFCAAPACwAAAAAEAAQAAAEWvDJSau9WA4AyAhWMChPwXHCQRUGYARgKQBCzJxAQgXzIC2KFkc1MREoHMTAhwQ0Y5oBgkMhAAqUw8mgWGho0EcCx5DwaAUQrGXATg6zE7bwCQ2sAGZmz7dEAAA7); color: green;}\
	.fish_clock{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAG/SURBVHjapJM/S8NQFMVvpaVfoEKojWL9U3DLIqjoooJDu/sFmnQoiIujQz+Aix3a1FUQXIR2UFA6+WeRUhBprERroGTopg6lSeo7iY1pq4sNHPpy3+8c7n0v9XW7XRrl8SFAlmVvbYFpmynOJHzXKkwlphOmxx4oiiL5sbAsi1KpFOVyuWQwGMzEYjEuGo0Sx3E2qOu6oKqqoChKst1u7zO2wNifDrLZLNbJUCgkLy2vEM/zv7araRrd3lxTq9US2WshnU7TGDZM01zwBwKZxaVlCkd4MtmxQDXlyVbvHXtgwMIDrx3Q6XS2Z2bnufDEJJkWuWIt2/LWwICFxw0wDCM+PTPXB0K4IGiwDhYeeP3fHQjjXIQMq3/mev3J/l0fqIOFxxtAxi+fg/rsBOztSE7QVpwpQT2PN6Dy1mgIYX7KNZcvipQ5yA+Fosum1rA93jMo1R6q7oxX50Va20wMzd4TWHi8t3BSvb/T1bpz4qsbf5vBgIXHDWB3+vj58b5fPj9jc9fcex8U9sCAhcc7Au1mDgtN7VU8Oz7SL0un9PbyTBYzQVijhj0wYOFxP2VJkv71Z8rn807AKM+XAAMArp1CsEFrDIIAAAAASUVORK5CYII=); color: blue;}\
	.fish_error{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJFSURBVHjapJO/T1pRFMe/Dx7ypEXri4lUGUhsHF40hODSpQ61cTH+2HSoZaF1dHSxpU7+Ca04NE7dyuBiapcuLFokTdD4A01awNdBSkAf8ut5zhUoxq3e5OS+nPv5nnvuyfdJpmniPksSBd68aM1pFDMU4xS+ei5GsUHxmSLRJD9+hcx7rVqFZWwMtc3NIGy2Zam31yX19ABdXTdgNuszdd1nptNBlMtviQ0TC0ujg1LgGWNByelctQ4M4G8qhfN4HLmDA6HvpJzq9eJRXx+qlDPz+deUDrd9+i6KoFouazVg2erx4M/uLn5FItGLk5NX/qUliYO+I2o2C4vLBWaYZQ1rRYFyqTQDVXXl02mcb29HbXb7S+/CwjqKRSAaDXlHRqYwOoqdxUUww6zQNApUSqVxuaMDF8kk2hTlgxYIHMMwaHSxEB2/a4g7u7sjzDDLmn8dXF35ZJsNVWrzycTEOtxuYH//lpjWezqbZoZZ1rQ+AXyj3eEQO7a27oj9s7OhVkZoWjqIFXUdD1QVub29L3fEk5MhXF7y2RwzzLKmdQYb+UwGiqLwO6duiVdWxM2GrvfTfOaZYZY1TScmvE7NKsvf3B6PyzE8jB9ra6DJR2TTnBYXSNIcbfN021Mjl8Pv09OzaqXyXIvnE6LAT00RRlLa21cfk1kesgNpULBab5xITiUHokADzJDJioYhjDSUKNafUKlgaHAwXCCHJQ8Pz1JHRyhQm2RhEfzNOT5jhlnWNJ+w0y/918/kPzbrf+M91rUAAwCuQDz94e2kLwAAAABJRU5ErkJggg==); color: blue;}\
	.fish_ok{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHsSURBVHjapFNBSBtBFH2xgoqmKipEC6XkYqhUWXOxUAQhpyJ4Wgi0l0rNsdBbL/WgF2/eV8hNSBF68uhFkOrFhCAGS8mWgmYjG9lCKVGTuP1vsrvuIac68HZm/n/vz5/9fyKu6+IhI8IA5k4kbHsuSAsWBZpnKwh2BTlBySfGdTmcAX7kOJc5r5hfhyw7/86t21/EVVbgmjb6yPG4SqsyONtWGaz0Dk8aYzMf0R+b65ju3+oR7OImrp3vGdluJd646KKj1ZK0H0XXRqfeo390Emg6HUEfOeQqjQwVoNFAOvpkPjYw8kw2NRgfFtQchm8jh1xqggDNJhYHY3Jy41IhmXodrDvZyKWG2m4vA23gcR9wa6m7Jue1YO2PsI1casIB5GPBWM8ilZLyvFzu+BPNwyz29oDM5+W2JhSg8NsqaRSTMHycxfg4MDHRJlUqgCWHO/IvyRGu0gQB5D671Z+mlpiZFXEejjSInrw/OS4wjiWwNFx8ehZnRVNpwlXI/SrXqvbFOfS3TxWRAtNpwxfTRw651AQZSE1Lrfrd6mmhZky96IGejuJgX5rL9HpbrvBKbHbFxunJDa6F67e0X0YsLWHr6uouc/StXi3m/yCRkNTjbXBNG33kkEtN8Jh2Pv3fY9I3vLfwkPFPgAEApRUigcIVl3AAAAAASUVORK5CYII=); color: purple;}\
	 .outerbox{border:5px solid #EAE3F7;}\
	.box{border:1px solid #6E41C2;color:#444;}\
	.box .title{padding:5px;line-height:20px;background-color:#B59DE2;color:#fff;}\
	.box .title a {color:white;}\
	.box .content{padding:5px;background-color:#fff;}\
	.box table{border-collapse:collapse; width:98%;}\
	.box table td{padding:5px;}\
	.box input[type=button],.fish_button {padding:5px;}\
	.box .name ,.box .caption,.box .caption td { background-color:#EAE3F7; font-weight:bold;}\
	.fish_sep td {border-top:1px solid #A688DD;}\
	.lineButton { cursor:pointer; border: 1px solid green; border-radius:3px; line-height: 16px; padding:3px; backround-color: lightgreen; color: green;}\
	.lineButton:hover { color: white; background-color: green; }\
.fishTab {border: 5px solid #E5D9EC;font-size: 12px;}\
.fishTab .innerTab {border-width: 1px;border-style: solid;border-color: #C7AED5;background-color: #fff;}\
.fishTab .tabNav {font-weight:bold;color:#F5F1F8;background-color: #C7AED5;line-height:25px;overflow:hidden;margin:0px;padding:0px;}\
.fishTab .tabNav li {float:left;list-style:none;cursor:pointer;padding-left: 20px;padding-right: 20px;}\
.fishTab .tabNav li:hover {background-color:#DACAE3;}\
.fishTab .tabNav li.current {background-color:#fff;color: #000;}\
.fishTab .tabContent {padding:5px;display:none;}\
.fishTab .tabContent p{margin:10px 0px 10px 0px;}\
.fishTab div.current {display:block;}\
.fishTab div.control {text-align:center;line-height:25px;background-color:#F0EAF4;}\
.fishTab input[type=button] { padding: 5px; }\
.hide {display:none;}\
.fish_button {background-color:#7077DA; color:#fff; border: 1px solid #7077DA;}";

	document.head.appendChild(s);
}

function injectDom() {
	var html = [];
	html.push('<div id="fishOption" style="width: 600px; display:none; box-shadow: 7px 7px 10px #A67EBC;">');
	html.push('<div class="innerTab">');
	html.push('<ul class="tabNav" default="tabVersion">');
	html.push('<li tab="tabLogin">登录设置</li>');
	html.push('<li tab="tabReg">注册</li>');
	html.push('<li tab="tabFaq">常见问题</li>');
	html.push('<li tab="tabVersion">版本信息</li>');
	html.push('<li tab="tabLog">运行日志</li>');
	html.push('<li tab="tabLoginIE">登录到IE</li>');//获取登录到IE的代码 Add By XPHelper
	html.push('</ul>');
	html.push('<div class="tabContent tabLogin">');
	html.push('<table>');
	html.push('<tr>');
	html.push('<td>重试时间 ');
	html.push('<td>');
	html.push('<td><input type="text" name="login.retryLimit" size="6" value="2000" />');
	html.push('(ms)</td>');
	html.push('<td>');
	html.push('<td>');
	html.push('<td></td>');
	html.push('</tr>');
	html.push('</table>');
	html.push('</div>');
	html.push('<div class="tabContent tabReg" style="text-indent: 20px">');
	html.push('<p>您好，为了避免未经授权便将作者免费发布的软件作为商品出售，请注册。<strong>注册码免费发布</strong>，<span style="color:red;">如果您从相关渠道购买捐助版本，请向卖家索取序列号（切记为合作版序列号，非合作版序列号一律为未授权出售，请向作者举报！）</span></p>');
	html.push('<p style="color: red;"> <strong style="font-size:16px;">特别提醒！本助手免费发布且不作为独立的软件出售！</strong>如果您在淘宝上购买本软件，请务必确认您购买的不是本助手且已经经过作者授权！如果相关宝贝页上没有说明本助手本身免费，请向作者举报，联系方式请<a href="http://www.fishlee.net/about/" target="_blank">参见这里</a>。 </p>');
	html.push('<p>任何版本之间，功能上没有任何区别，请各位谅解作者为防有卖家未经授权进行销售而加入的措施。</p>');
	html.push('<p class="registered" style="display:none;">您好，<strong>fishcn@foxmail.com</strong>，感谢您的使用。已注册版本：<strong>正式版</strong>【<a href="javascript:;" id="unReg">重新注册</a>】</p>');
	html.push('<table class="regTable" style="display:none;width:98%;">');
	html.push('<tr>');
	html.push('<td>请黏贴注册信息 【<a href="http://www.fishlee.net/Apps/Cn12306/GetNormalRegKey?v=1" target="_blank" style="color:blue;text-decoration:underline;">点击这里免费申请序列号</a>】</td>');
	html.push('</tr><tr>');
	html.push('<td style="text-align:center;"><textarea id="regContent" style="width:98%; height:50px;"></textarea></td>');
	html.push('</tr><tr>');
	html.push('<td><input type="button" id="regButton" value="确定完成" /></td>');
	html.push('</tr>');
	html.push('</table>');
	html.push('</div>');
	html.push('<div class="tabContent tabVersion" style="text-indent: 20px">');
	html.push('<h4 style="font-size:18px; font-weight:bold; margin: 0px; line-height: 26px; border-bottom: 1px dotted #ccc;">12306 订票助手 <small>ver ' + window.helperVersion + '</small></h4>');
	html.push('<p> 12306 订票助手是一款基于12306.CN订票网站、并运行在各浏览器平台基础之上的助手软件，支持的浏览器为Firefox/谷歌浏览器/遨游3，以及相关衍生浏览器。<strong>本软件免费开源，无需付费使用，仅接受捐助。</strong> </p>');
	html.push('<p style="color: red;"> <strong style="font-size:16px;">特别提醒！本助手免费发布且不作为独立的软件出售！</strong>淘宝等任何无法提供『<strong>合作版序列号</strong>』的出售均属『侵权出售』，请退款、并向淘宝和作者举报！联系方式请<a href="http://www.fishlee.net/about/" target="_blank">参见这里</a>。 </p>');
	html.push('<p style="color:purple;"> 回家是一个单纯而简单的心愿，希望我们不会变得太复杂……</p>');
	html.push('<p> 有很多朋友捐助，非常感谢你们的支持和鼓励。详细捐助名单和相关的捐助方式，请<a href="http://www.fishlee.net/soft/44/donate.html" target="_blank">参见这里</a>。 </p>');
	html.push('<p style="font-weight:bold;">当前版本更新内容</p>');
	html.push('<ol>');
	$.each(utility.getPref("updates").split('\t'), function (i, n) {
		html.push("<li style='padding-left:20px;list-style:disc inside;'>" + n + "</li>");
	});
	html.push('</ol>');
	html.push('</div>');
	html.push('<div class="tabContent tabFaq">');
	html.push('<table>');
	html.push('<tr>');
	html.push('<td colspan="4"> 您好，你在订票过程中可能会遇到各种问题，由于12306网站本身没有任何介绍，所以作者整理了相关问题，供您参考。如果还有不明白的问题，请加群讨论。 </td>');
	html.push('</tr>');
	html.push('<tr style="display:none;">');
	html.push('<td><a href="http://www.fishlee.net/soft/44/12306faq.html" target="_blank">订票常见问题</a></td>');
	html.push('<td><a href="http://www.fishlee.net/soft/44/faq.html" target="_blank">助手运行常见问题</a></td>');
	html.push('</tr>');
	html.push('</table>');
	html.push('</div><div class="tabLog tabContent"><div>下面是当前页面的记录。如果您的助手遇到功能上的问题，请全部复制后发成邮件给作者：ifish@fishlee.net 以便于我们解决问题。<span style="color:red;font-weight:bold;">请在发送前务必剔除记录中包含的个人隐私如密码等信息。</span></div><textarea id="runningLog" style="width:100%;height:200px;"></textarea></div>');
	//获取登录到IE的代码 Add By XPHelper
	html.push('<div class="tabLoginIE tabContent"><div><strong>先在IE中打开 https://dynamic.12306.cn/otsweb，</strong>再将以下代码复制到IE浏览器的地址栏。确认地址栏最前面有“javascript:”字样，没有请手动加上（IE10会自动删除这样的代码），然后敲回车，等待页面刷新后，即可自动登录。</div><textarea id="LoginIECode" style="width:100%;height:200px;"></textarea></div>');
	html.push('<div class="control">');
	html.push('<input type="button" class="close_button" value="关闭" />');
	html.push('</div>');
	html.push('</div>');
	html.push('</div>');

	$("body").append(html.join(""));

	var opt = $("#fishOption");
	$("#regButton").click(function () {
		var sn = $.trim($("#regContent").val());

		var rt = utility.verifySn(false, "", sn);
		if (rt.result != 0) {
			alert("很抱歉, 注册失败. 代码 " + rt.result + ", " + rt.msg);
		} else {
			utility.setSnInfo("", sn);
			alert("注册成功, 请刷新浏览器。\n注册给 - " + rt.name + " , 注册类型 - " + rt.typeDesc.replace(/<[^>]*>/gi, ""));
			top.location.reload();
		}
	});
	$("#unReg, a.reSignHelper").live("click", function () {
		if (!confirm("确定要重新注册吗?")) return;

		utility.setSnInfo("", "");
		self.location.reload();
	});

	//初始化设置
	utility.configTab = utility.fishTab(opt);
	opt.find("input[name]").each(function () {
		var el = $(this);
		var key = el.attr("name");
		var value = window.localStorage.getItem(key);
		if (!value) return;

		el.val(value);
	}).change(function () {
		var el = $(this);
		var key = el.attr("name");
		window.localStorage.setItem(key, el.val());
	});
	$("#configLink, a.configLink").live("click", function () {
		var el = $(this);
		var dp = el.attr("tab");
		if (dp) utility.configTab.showTab(dp);
		utility.showOptionDialog();
	});

	//新版本更新显示提示
	if (utility.getPref("helperVersion") != window.helperVersion) {
		utility.setPref("helperVersion", window.helperVersion);
		utility.showOptionDialog("tabVersion");

		alert("【重要提示】\n========================\n自2013年1月4日起预售期改为20天，请提前做好买票准备。\n\n使用助手提供的各项功能前，请务必做好演练，以避免不熟悉给您带来损失。\n\n" +
			"任何时候回家都是一种永恒的夙愿，祝大家都能安全快捷地回家 :-)"
			);
	}

	//注册
	var result = utility.verifySn(true);
	if (result.result == 0) {
		var info = opt.find(".registered").show().find("strong");
		info.eq(0).html(result.name);
		info.eq(1).html(result.typeDesc);


	} else {
		opt.find(".regTable").show();

		if (location.pathname == "/otsweb/loginAction.do") {
			alert("您好, 您的12306助手尚未注册, 为了防止有人未经作者授权直接出售获利, 请注册.\n注册是免费的, 但请不要从淘宝等渠道购买未注明【免费】的非捐助版本！");
			utility.showOptionDialog("tabReg");
		}
	}
	utility.regInfo = result;
}

//#endregion

//#region -----------------执行环境兼容----------------------

var utility = {
	configTab: null,
	icon: "http://www.12306.cn/mormhweb/images/favicon.ico",
	notifyObj: null,
	timerObj: null,
	regInfo: null,
	isWebKit: function () {
		return navigator.userAgent.indexOf("WebKit") != -1;
	},
	trim: function (data) {
		if (typeof ($) != 'undefined') return $.trim(data);

		return data.replace(/(^\s+|\s+$)/g, "");
	},
	init: function () {
		$.extend({
			any: function (array, callback) {
				var flag = false;
				$.each(array, function (i, v) {
					flag = callback.call(this, i, v);
					if (flag) return false;
				});
				return flag;
			},
			first: function (array, callback) {
				var result = null;
				$.each(array, function (i, v) {
					result = callback.call(this, i, v);
					if (result) return false;
				});
				return result;
			}
		});
	},
	runningQueue: null,
	appendLog: function (settings) {
		/// <summary>记录日志</summary>
		if (!utility.runningQueue) utility.runningQueue = [];
		var log = { url: settings.url, data: settings.data, response: null, success: null };
		if (log.url.indexOf("Passenger") != -1) return;	//不记录对乘客的请求

		utility.runningQueue.push(log);
		settings.log = log;
	},
	showLog: function () {
		if (!utility.runningQueue) {
			alert("当前页面尚未产生日志记录。");
			return;
		}

		var log = [];
		$.each(utility.runningQueue, function () {
			log.push("成功：" + (this.success ? "是" : "否") + "\r\n地址：" + this.url + "\r\n提交数据：" + utility.formatData(this.data) + "\r\n返回数据：" + utility.formatData(this.response));
		});
		$("#runningLog").val(log.join("\r\n----------------------------------\r\n"));

		utility.showOptionDialog("tabLog");
	},
	//获取登录到IE的代码 Add By XPHelper
	showLoginIE: function () {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split("; ");
		var IECode = "javascript:";
		var cookie = [];
		for (var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split("=");
			cookie.push("document.cookie=\"" + arr[0] + "=" + arr[1] + "\";");
		}
		IECode += cookie.join("");
		IECode += "self.location.reload();";
		$("#LoginIECode").val(IECode);
		utility.showOptionDialog("tabLoginIE");
	},
	formatData: function (data) {
		if (!data) return "(null)";
		if (typeof (data) == "string") return data;
		var html = [];
		for (var i in data) {
			html.push('"' + i + '":\"' + (this[i] + "").replace(/(\r|\n|")/g, function (a) { "\\" + a; }) + '\"');
		}
		return "{" + html.join(",") + "}";
	},
	notify: function (msg, timeout) {
		console.log("信息提示: " + msg);
		if (window.webkitNotifications) {
			if (window.webkitNotifications.checkPermission() == 0) {
				utility.closeNotify();

				if (utility.notifyObj == null)
					utility.notifyObj = webkitNotifications.createNotification(utility.icon, '订票', msg);
				utility.notifyObj.show();
				if (!timeout || timeout != 0) utility.timerObj = setTimeout(utility.closeNotify, timeout || 5000);
			} else {
				alert("【警告：您尚未允许脚本的Notify权限！请开启以避免使用这种对话框来进行提示！】\n\n" + msg);
			}
		} else {
			if (typeof (GM_notification) != 'undefined') {
				GM_notification(msg);
			} else {
				console.log("主页面中脚本信息, 无法提示, 写入通知区域.");
				utility.notifyOnTop(msg);
			}
		}
	},
	notifyOnTop: function (msg) {
		window.localStorage.setItem("notify", msg);
	},
	closeNotify: function () {
		if (!utility.notifyObj) return;

		utility.notifyObj.cancel();
		if (utility.timerObj) {
			clearTimeout(utility.timerObj);
		}
		utility.timerObj = null;
		utility.notifyObj = null;
	},
	setPref: function (name, value) {
		window.localStorage.setItem(name, value);
	},
	getPref: function (name) {
		return window.localStorage.getItem(name);
	},
	unsafeCallback: function (callback) {
		if (typeof (unsafeInvoke) == "undefined") callback();
		else unsafeInvoke(callback);
	},
	getTimeInfo: function () {
		var d = new Date();
		return d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
	},
	savePrefs: function (obj, prefix) {
		var objs = obj.find("input");
		objs.change(function () {
			var type = this.getAttribute("type");
			if (type == "text") utility.setPref(prefix + "_" + this.getAttribute("id"), $(this).val());
			else if (type == "checkbox") utility.setPref(prefix + "_" + this.getAttribute("id"), this.checked ? 1 : 0);
		})
	},
	reloadPrefs: function (obj, prefix) {
		var objs = obj.find("input");
		prefix = prefix || "";
		objs.each(function () {
			var e = $(this);
			var type = e.attr("type");
			var id = e.attr("id");
			var value = utility.getPref(prefix + "_" + id);
			if (typeof (value) == "undefined" || value == null) return;

			if (type == "text") e.val(value);
			else if (type == "checkbox") this.checked = value == "1";
			e.change();
		});
		utility.savePrefs(obj, prefix);
	},
	getErrorMsg: function (msg) {
		/// <summary>获得给定信息中的错误信息</summary>
		var m = msg.match(/var\s+message\s*=\s*"([^"]*)/);
		return m && m[1] ? m[1] : "&lt;未知信息&gt;";
	},
	delayInvoke: function (target, callback, timeout) {
		target = target || "#countEle";
		var e = typeof (target) == "string" ? $(target) : target;
		if (timeout <= 0) {
			e.html("正在执行").removeClass("fish_clock").addClass("fish_running");
			callback();
		} else {
			var str = (Math.floor(timeout / 100) / 10) + '';
			if (str.indexOf(".") == -1) str += ".0";
			e.html(str + " 秒后再来!...").removeClass("fish_running").addClass("fish_clock");
			setTimeout(function () {
				utility.delayInvoke(target, callback, timeout - 500);
			}, 500);
		}
	},
	saveList: function (name) {
		/// <summary>将指定列表的值保存到配置中</summary>
		var dom = document.getElementById(name);
		window.localStorage["list_" + name] = utility.getOptionArray(dom).join("\t");
	},
	loadList: function (name) {
		/// <summary>将指定的列表的值从配置中加载</summary>
		var dom = document.getElementById(name);
		var data = window.localStorage["list_" + name];
		if (!data) return;

		if (data.indexOf("\t") != -1)
			data = data.split('\t');
		else data = data.split('|');
		$.each(data, function () {
			dom.options[dom.options.length] = new Option(this, this);
		});
	},
	addOption: function (dom, text, value) {
		/// <summary>在指定的列表中加入新的选项</summary>
		dom.options[dom.options.length] = new Option(text, value);
	},
	getOptionArray: function (dom) {
		/// <summary>获得选项的数组格式</summary>
		return $.map(dom.options, function (o) { return o.value; });
	},
	inOptionList: function (dom, value) {
		/// <summary>判断指定的值是否在列表中</summary>
		for (var i = 0; i < dom.options.length; i++) {
			if (dom.options[i].value == value) return true;
		}
		return false;
	},
	getAudioUrl: function () {
		/// <summary>获得音乐地址</summary>
		return window.localStorage["audioUrl"] || (navigator.userAgent.indexOf("Firefox") != -1 ? "https://github.com/iccfish/12306_ticket_helper/raw/master/res/song.ogg" : "http://www.w3school.com.cn/i/song.ogg");
	},
	getFailAudioUrl: function () {
		return (utility.isWebKit() ? "http://resbak.fishlee.net/res/" : "https://github.com/iccfish/12306_ticket_helper/raw/master/res/") + "music3.ogg";
	},
	playFailAudio: function () {
		if (!window.Audio) return;
		new Audio(utility.getFailAudioUrl()).play()
	},
	resetAudioUrl: function () {
		/// <summary>恢复音乐地址为默认</summary>
		window.localStorage.removeItem("audioUrl");
	},
	parseDate: function (s) { /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/.exec(s); return new Date(RegExp.$1, RegExp.$2 - 1, RegExp.$3); },
	getDate: function (s) {
		/// <summary>获得指定日期的天单位</summary>
		return new Date(s.getFullYear(), s.getMonth(), s.getDate());
	},
	formatDate: function (d) {
		/// <summary>格式化日期</summary>
		var y = d.getFullYear();

		return y + "-" + utility.formatDateShort(d);
	},
	formatDateShort: function (d) {
		/// <summary>格式化日期</summary>
		var mm = d.getMonth() + 1;
		var d = d.getDate();

		return (mm > 9 ? mm : "0" + mm) + "-" + (d > 9 ? d : "0" + d);
	},
	addTimeSpan: function (date, y, mm, d, h, m, s) {
		/// <summary>对指定的日期进行偏移</summary>
		return new Date(date.getFullYear() + y, date.getMonth() + mm, date.getDate() + d, date.getHours() + h, date.getMinutes() + m, date.getSeconds() + s);
	},
	serializeForm: function (form) {
		/// <summary>序列化表单为对象</summary>
		var v = {};
		var o = form.serializeArray();
		for (var i in o) {
			if (typeof (v[o[i].name]) == 'undefined') v[o[i].name] = o[i].value;
			else v[o[i].name] += "," + o[i].value;
		}
		return v;
	},
	getSecondInfo: function (second) {
		var show_time = "";
		var hour = parseInt(second / 3600);  //时
		if (hour > 0) {
			show_time = hour + "小时";
			second = second % 3600;
		}
		var minute = parseInt(second / 60);  //分
		if (minute >= 1) {
			show_time = show_time + minute + "分";
			second = second % 60;
		} else if (hour >= 1 && second > 0) {
			show_time = show_time + "0分";
		}
		if (second > 0) {
			show_time = show_time + second + "秒";
		}

		return show_time;
	},
	post: function (url, data, dataType, succCallback, errorCallback) {
		$.ajax({
			url: url,
			data: data,
			timeout: 30000,
			type: "POST",
			success: succCallback,
			error: errorCallback,
			dataType: dataType
		});
	},
	get: function (url, data, dataType, succCallback, errorCallback) {
		$.ajax({
			url: url,
			data: data,
			timeout: 30000,
			type: "GET",
			success: succCallback,
			error: errorCallback,
			dataType: dataType
		});
	},
	showDialog: function (object, optx) {
		/// <summary>显示对话框。其中带有 close_button 样式的控件会自动作为关闭按钮</summary>
		return (function (opt) {
			var dataKey = "fs_dlg_opt";
			if (this.data(dataKey)) {
				this.data(dataKey).closeDialog();
				return;
			}

			opt = $.extend({ bindControl: null, removeDialog: this.attr("autoCreate") == "1", onClose: null, animationMove: 20, speed: "fast", fx: "linear", show: "fadeInDown", hide: "fadeOutUp", onShow: null, timeOut: 0 }, opt);
			this.data("fs_dlg_opt", opt);
			var top = "100px";
			var left = "50%";

			this.css({
				"position": opt.parent ? "absolute" : "fixed",
				"left": left,
				"top": top,
				"margin-left": "-" + (this.width() / 2) + "px",
				"margin-top": "0px",
				"z-index": "9999"
			});
			if ($.browser.msie && $.browser.version <= 6) {
				this.css({
					position: "absolute",
					top: (($(window).height() / 2) + (document.body.scrollTop || document.documentElement.scrollTop) - this.height() / 2) + "px",
					"margin-top": "0px"
				});
			}
			var obj = this;
			this.changeLoadingIcon = function (icon) {
				/// <summary>更改加载对话框的图标</summary>
				obj.removeClass().addClass("loadingDialog loadicon_" + (icon || "tip"));
				return obj;
			};
			this.autoCloseDialog = function (timeout) {
				/// <summary>设置当前对话框在指定时间后自动关闭</summary>
				setTimeout(function () { obj.closeDialog(); }, timeout || 2500);
				return obj;
			};
			this.setLoadingMessage = function (msgHtml) {
				obj.find("div").html(msgHtml);
				return obj;
			};
			this.closeDialog = function () {
				/// <summary>关闭对话框</summary>
				obj.removeData(dataKey);
				obj.animate({ "marginTop": "+=" + opt.animationMove + "px", "opacity": "hide" }, opt.speed, opt.fx, function () {
					if (opt.bindControl) opt.bindControl.enable();
					if (opt.onClose) opt.onClose.call(obj);
					if (opt.removeDialog) obj.remove();
				})

				return obj;
			};
			$('.close_button', this).unbind("click").click(obj.closeDialog);
			//auto close
			if (opt.timeOut > 0) {
				var handler = opt.onShow;
				opt.onShow = function () {
					setTimeout(function () { $(obj).closeDialog(); }, opt.timeOut);
					if (handler != null) handler.call(this);
				};
			}
			//show it
			if (opt.bindControl) opt.bindControl.disable();
			this.animate({ "marginTop": "+=" + opt.animationMove + "px", "opacity": "show" }, opt.speed, opt.fx, function () { opt.onShow && opt.onShow.call(obj); })
			this.data(dataKey, this);

			return this;
		}).call(object, optx);
	},
	fishTab: function (obj, opt) {
		return (function (opt) {
			var self = this;
			opt = $.extend({ switchOnHover: false, switchOnClick: true }, opt);
			this.addClass("fishTab");


			this.showTab = function (tabid) {
				self.find(".current").removeClass("current");
				self.find("ul.tabNav li[tab=" + tabid + "], div." + tabid).addClass("current");
			};
			self.find(".tabNav li").hover(function () {
				if (!opt.switchOnHover) return;
				self.showTab($(this).attr("tab"));
			}).click(function () {
				if (!opt.switchOnClick) return;
				self.showTab($(this).attr("tab"));
			});
			this.showTab(self.find(".tabNav").attr("default") || self.find(".tabNav li:eq(0)").attr("tab"));

			return this;
		}).call(obj, opt);
	},
	getLoginRetryTime: function () {
		return parseInt(window.localStorage.getItem("login.retryLimit")) || 2000;
	},
	showOptionDialog: function (tab) {
		if (tab) utility.configTab.showTab(tab);
		utility.showDialog($("#fishOption"));
		location.hash = "fishOption";
	},
	addCookie: function (name, value, expDays) {
		var cook = name + "=" + value + "; path=/; domain=.12306.cn";
		if (expDays > 0) {
			cook += "; expires=" + new Date(new Date().getTime() + expDays * 3600 * 1000 * 24).toGMTString();
		}
		document.cookie = cook;
	},
	getCookie: function (name) {
		var cook = document.cookie;
		var arr = cook.split("; ");
		for (var i = 0; i < arr.length; i++) {
			var arg = arr[i].split('=');
			if (arg[0] == name) return arg[1];
		}
	},
	setSnInfo: function (name, sn) {
		utility.setPref("helper.regUser", name);
		utility.setPref("helper.regSn", sn);
		utility.addCookie("helper.regUser", name, 999);
		utility.addCookie("helper.regSn", sn, 999);
	},
	verifySn: function (skipTimeVerify, name, sn) {
		name = name || utility.getPref("helper.regUser") || utility.getCookie("helper.regUser");
		sn = sn || utility.getPref("helper.regSn") || utility.getCookie("helper.regSn");
		if (!name && sn) return utility.verifySn2(skipTimeVerify, sn);
		if (!name || !sn) return { result: -4, msg: "未注册" };

		utility.setSnInfo(name, sn);

		var args = sn.split(',');
		if (!skipTimeVerify) {
			if ((new Date() - args[0]) / 60000 > 5) {
				return { result: -1, msg: "序列号注册已失效" };
			}
		}
		var dec = [];
		var encKey = args[0] + args[1];
		var j = 0;
		for (var i = 0; i < args[2].length; i += 4) {
			dec.push(String.fromCharCode(parseInt(args[2].substr(i, 4), 16) ^ encKey.charCodeAt(j)));
			j++;
			if (j >= encKey.length) j = 0;
		}
		var data = dec.join("");
		data = { result: null, type: data.substring(0, 4), name: data.substring(4) };
		data.result = data.name == name ? 0 : -3;
		data.msg = data.result == 0 ? "成功验证" : "注册无效"
		data.typeDesc = data.type == "NRML" ? "正式版" : (data.type == "GROP" ? "内部版, <span style='color:blue;'>感谢您参与我们之中</span>!" : "<span style='color:red;'>捐助版, 非常感谢您的支持</span>!");

		return data;
	},
	verifySn2: function (skipTimeVerify, data) {
		data = utility.trim(data);
		try {
			var nameLen = parseInt(data.substr(0, 2), 16);
			var name = data.substr(2, nameLen);
			data = data.substring(2 + nameLen);

			var arr = [];
			for (var i = 0; i < data.length; i++) {
				var c = data.charCodeAt(i);
				if (c >= 97) arr.push(String.fromCharCode(c - 49));
				else arr.push(data.charAt(i));
			}
			data = arr.join("");
			var ticket = parseInt(data.substr(0, 14), 16);
			var key = parseInt(data.substr(14, 1), 16);
			var encKey = ticket.toString(16).toUpperCase() + key.toString().toUpperCase();
			data = data.substring(15);
			var dec = [];
			var j = 0;
			for (var i = 0; i < data.length; i += 4) {
				dec.push(String.fromCharCode(parseInt(data.substr(i, 4), 16) ^ encKey.charCodeAt(j)));
				j++;
				if (j >= encKey.length) j = 0;
			}
			dec = dec.join("").split('|');
			var regVersion = dec[0].substr(0, 4);
			var regName = dec[0].substring(4);
			var bindAcc = dec.slice(1, dec.length);

			if (!bindAcc && !skipTimeVerify && (new Date() - ticket) / 60000 > 5) {
				return { result: -1, msg: "注册码已失效， 请重新申请" };
			}
			if (regName != name) {
				return { result: -3, msg: "注册失败，用户名不匹配" };
			}
			var data = { name: name, type: regVersion, bindAcc: bindAcc, ticket: ticket, result: 0, msg: "成功注册" };
			switch (data.type) {
				case "NRML": data.typeDesc = "正式版"; break;
				case "GROP": data.typeDesc = "内部版, <span style='color:blue;'>感谢您参与我们之中</span>!"; break;
				case "DONT": data.typeDesc = "<span style='color:red;'>捐助版, 非常感谢您的支持</span>!"; break;
				case "PART": data.typeDesc = "合作版，欢迎您的使用";
			}
			data.regTime = new Date(ticket);
			data.regVersion = 2;

			return data;
		} catch (e) {
			return { result: -4, msg: "数据错误" };
		}
	},
	allPassengers: null,
	getAllPassengers: function (callback) {
		if (utility.allPassengers) {
			callback(utility.allPassengers);
		}

		//开始加载所有乘客
		utility.allPassengers = [];
		var pageIndex = 0;

		function loadPage() {
			utility.post("/otsweb/passengerAction.do?method=queryPagePassenger", { pageSize: 10, pageIndex: pageIndex }, "json", function (json) {
				//json.recordCount
				//json.rows
				$.each(json.rows, function () { utility.allPassengers.push(this); });

				if (utility.allPassengers.length >= json.recordCount) {
					callback(utility.allPassengers);
				} else {
					pageIndex++;
					setTimeout(loadPage, 1000);
				}
			}, function () {
				setTimeout(loadPage, 3000);
			});
		}

		loadPage();
	},
	regCache: {},
	getRegCache: function (value) {
		return utility.regCache[value] || (utility.regCache[value] = new RegExp("^" + value + "$", "i"));
	},
	preCompileReg: function (optionList) {
		var data = $.map(optionList, function (e) {
			return e.value;
		});
		return new RegExp("^(" + data.join("|") + ")$", "i");
	},
	enableLog: function () {
		$("body").append('<button style="width:100px;position:fixed;right:0px;top:0px;height:35px;" onclick="utility.showLog();">显示运行日志</button>');
		$(document).ajaxSuccess(function (a, b, c) {
			if (!c.log) return;
			c.log.response = b.responseText;
			c.log.success = true;
		}).ajaxSend(function (a, b, c) {
			utility.appendLog(c);
		}).ajaxError(function (a, b, c) {
			if (!c.log) return;
			c.log.response = b.responseText;
		});
	},
	//获取登录到IE的代码 Add By XPHelper
	enableLoginIE: function () {
		$("body").append('<button style="width:150px;position:fixed;right:0px;top:0px;height:35px;" onclick="utility.showLoginIE();">获取登录到IE的代码</button>');
	},
	analyzeForm: function (html) {
		var data = {};

		//action
		var m = /<form.*?action="([^"]+)"/.exec(html);
		data.action = m ? RegExp.$1 : "";

		//inputs
		data.fields = {};
		var inputs = html.match(/<input\s*(.|\r|\n)*?>/gi);
		$.each(inputs, function () {
			if (!/name=['"]([^'"]+?)['"]/.exec(this)) return;
			var name = RegExp.$1;
			data.fields[RegExp.$1] = !/value=['"]([^'"]+?)['"]/.exec(this) ? "" : RegExp.$1;
		});

		//tourflag
		m = /submit_form_confirm\('confirmPassenger','([a-z]+)'\)/.exec(html);
		if (m) data.tourFlag = RegExp.$1;

		return data;
	},
	appendScript: function (url, content, callback) {
		var s = document.createElement('script');
		if (url) s.src = 'https://github.com/iccfish/12306_ticket_helper/raw/master/version.js';
		if (content) s.textContent = content;
		s.type = 'text/javascript';
		if (callback) s.addEventListener('load', callback);

		document.head.appendChild(s);
	}
}

function beginExecute() {
	/// <summary>开始执行脚本</summary>
	entryPoint();
}

function unsafeInvoke(callback) {
	/// <summary>非沙箱模式下的回调</summary>
	var cb = document.createElement("script");
	cb.type = "text/javascript";
	cb.textContent = buildCallback(callback);
	document.head.appendChild(cb);
}

function buildCallback(callback) {
	var content = "";
	if (!utility_emabed) {
		content += "if(typeof(window.utility)!='undefined' && navigator.userAgent.indexOf('Maxthon')==-1){ alert('警告! 检测到您似乎同时运行了两个12306购票脚本! 请转到『附加组件管理『（Firefox）或『扩展管理』（Chrome）中卸载老版本的助手！');}; \r\nwindow.utility=" + buildObjectJavascriptCode(utility) + "; window.utility.init();window.helperVersion='" + version + "';\r\n";
		utility_emabed = true;
	}
	content += "window.__cb=" + buildObjectJavascriptCode(callback) + ";\r\n\
	if(typeof(jQuery)!='undefined')window.__cb();\r\n\
	else{\
		var script=document.createElement('script');\r\nscript.src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';\r\n\
		script.type='text/javascript';\r\n\
		script.addEventListener('load', window.__cb);\r\n\
		document.head.appendChild(script);\r\n\
	}";

	return content;
}

function buildObjectJavascriptCode(object) {
	/// <summary>将指定的Javascript对象编译为脚本</summary>
	if (!object) return null;

	var t = typeof (object);
	if (t == "string") {
		return "\"" + object.replace(/(\r|\n|\\)/gi, function (a, b) {
			switch (b) {
				case "\r":
					return "\\r";
				case "\n":
					return "\\n";
				case "\\":
					return "\\\\";
			}
		}) + "\"";
	}
	if (t != "object") return object + "";

	var code = [];
	for (var i in object) {
		var obj = object[i];
		var objType = typeof (obj);

		if ((objType == "object" || objType == "string") && obj) {
			code.push(i + ":" + buildObjectJavascriptCode(obj));
		} else {
			code.push(i + ":" + obj);
		}
	}

	return "{" + code.join(",") + "}";
}

var isChrome = navigator.userAgent.indexOf("AppleWebKit") != -1;
var isFirefox = navigator.userAgent.indexOf("Firefox") != -1;

if (location.host == "dynamic.12306.cn" || (location.host == "www.12306.cn" && location.protocol == "https:")) {
	if (!isChrome && !isFirefox) {
		alert("很抱歉，未能识别您的浏览器，或您的浏览器尚不支持脚本运行，请使用Firefox或Chrome浏览器！\n如果您运行的是Maxthon3，请确认当前页面运行在高速模式而不是兼容模式下 :-)");
	} else if (isFirefox && typeof (GM_notification) == 'undefined') {
		alert("很抱歉，本脚本需要最新的Scriptish扩展、不支持GreaseMonkey，请禁用您的GreaseMonkey扩展并安装Scriptish！");
		window.open("https://addons.mozilla.org/zh-CN/firefox/addon/scriptish/");
	} else if (!window.localStorage) {
		alert("警告! localStorage 为 null, 助手无法运行. 请查看浏览器是否已经禁用 localStorage!\nFirefox请设置 about:config 中的 dom.storage.enabled 为 true .");
	} else {
		//记录更新
		utility.setPref("updates", updates.join("\t"));

		initUIDisplay();
		unsafeInvoke(injectDom);
		beginExecute();
	}
}

//#endregion

//#region -----------------入口----------------------

function entryPoint() {
	var location = window.location;
	var path = location.pathname;

	utility.regInfo = utility.verifySn(true);
	if (utility.regInfo.result != 0) {
		return;
	}

	//
	unsafeInvoke(autoReloadIfError);
	if ((path == "/otsweb/loginAction.do" && location.search != '?method=initForMy12306') || path == "/otsweb/login.jsp") {
		//登录页
		unsafeInvoke(initLogin);
		checkUpdate();
	}
	if (utility.regInfo.bindAcc && localStorage.getItem("_sessionuser") && utility.regInfo.bindAcc.length > 0 && utility.regInfo.bindAcc[0] && utility.regInfo.bindAcc[0] != "*") {
		var user = localStorage.getItem("_sessionuser");
		var ok = false;
		for (var i = 0; i < utility.regInfo.bindAcc.length; i++) {
			if (utility.regInfo.bindAcc[i] == user) {
				ok = true;
				break;
			}
		}
		if (!ok) return;
	}
	if (path == "/otsweb/order/querySingleAction.do") {
		if (location.search == "?method=init" && document.getElementById("submitQuery")) {
			unsafeInvoke(initTicketQuery);
			unsafeInvoke(initDirectSubmitOrder);
		}
		if (location.search == "?method=submutOrderRequest") {
			unsafeInvoke(initSubmitOrderQuest);
		}
	}
	if (path == "/otsweb/order/myOrderAction.do") {
		if (location.search.indexOf("method=resign") != -1 && document.getElementById("submitQuery")) {
			unsafeInvoke(initTicketQuery);
			unsafeInvoke(initDirectSubmitOrder);
		}
	}
	if (path == "/otsweb/order/confirmPassengerAction.do") {
		if (location.search == "?method=init") {
			unsafeInvoke(initAutoCommitOrder);
			unsafeInvoke(autoCommitOrderInSandbox);
		}
		if (location.search.indexOf("?method=payOrder") != -1) {
			unsafeInvoke(initPagePayOrder);
			//获取登录到IE的代码 Add By XPHelper
			unsafeInvoke(utility.enableLoginIE);
		}
	}
	if (path == "/otsweb/order/myOrderAction.do") {
		if (location.search.indexOf("?method=laterEpay") != -1 || location.search.indexOf("?method=queryMyOrderNotComplete") != -1) {
			unsafeInvoke(initNotCompleteOrderPage);
			unsafeInvoke(initPayOrder);
			//获取登录到IE的代码 Add By XPHelper
			unsafeInvoke(utility.enableLoginIE);
		}
	}
	if (path == "/otsweb/main.jsp" || path == "/otsweb/") {
		//主框架
		console.log("正在注入主框架脚本。");

		//跨页面弹窗提示，防止因为页面跳转导致对话框不关闭
		console.log("启动跨页面信息调用检查函数");
		window.setInterval(function () {
			var msg = window.localStorage["notify"];
			if (typeof (msg != 'undefined') && msg) {
				console.log("主窗口拦截提示请求: " + msg);
				window.localStorage.removeItem("notify");
				utility.notify(msg);
			}
		}, 100);

		unsafeInvoke(injectMainPageFunction);
	}
}

//#endregion

//#region 未完成订单查询页面

function initNotCompleteOrderPage() {
	//处理显示时间的
	(function () {
		var tagInputs = $("input[name=cache_tour_flag]");
		var flags = $.map(tagInputs, function (e, i) { return e.value; });
		$.each(flags, function () { $("#showTime_" + this).hide().after("<span id='status_" + this + "'>正在查询...</span>"); });

		function doCheck() {
			var flag = flags.shift();
			flags.push(flag);

			utility.get("https://dynamic.12306.cn/otsweb/order/myOrderAction.do?method=getOrderWaitTime&tourFlag=" + flag, null, "json", function (data) {
				var obj = $("#status_" + flag);
				if (data.waitTime == 0 || data.waitTime == -1) {
					obj.css({ "color": "green" }).html("订票成功！");
					utility.notifyOnTop("订票成功！请尽快付款！");
					parent.playAudio();
					self.location.reload();
					return;
				}

				if (data.waitTime == -2) {
					utility.notifyOnTop("出票失败！请重新订票！" + data.msg);
					parent.playFailAudio();
					obj.css({ "color": "red" }).html("出票失败！" + data.msg);

					return;
				}
				if (data.waitTime == -3) {
					utility.notifyOnTop("订单已经被取消！");
					parent.playFailAudio();
					obj.css({ "color": "red" }).html("订单已经被取消！！");

					return;
				}
				if (data.waitTime == -4) {
					utility.notifyOnTop("正在处理中....");
					obj.css({ "color": "blue" }).html("正在处理中....");
				}

				if (data.waitTime > 0) {
					obj.css({ "color": "red" }).html("排队中<br />排队数【" + (data.waitCount || "未知") + "】<br />预计时间【" + utility.getSecondInfo(data.waitTime) + "】<br />不过这时间不<br />怎么靠谱 ╮(╯▽╰)╭");
				} else {
					obj.css({ "color": "red" }).html("奇怪的状态码 [" + data.waitTime + "]....");
				}


				setTimeout(doCheck, 2000);
			}, function () {
				utility.notifyOnTop("查询状态错误，正在刷新页面！");
				self.location.reload();
			});
		}

		if (flags.length > 0) doCheck();
	})();
}

//#endregion

//#region 提交页面出错

function initSubmitOrderQuest() {
	if ($("div.error_text").length > 0) {
		parent.window.resubmitForm();
	}
}

//#endregion

//#region 订票页面，声音提示

function initPagePayOrder() {
	new Audio(utility.getAudioUrl()).play();
}

//#endregion

//#region -----------------出错自动刷新----------------------

function autoReloadIfError() {
	if ($.trim($("h1:first").text()) == "错误") {
		$("h1:first").css({ color: 'red', 'font-size': "18px" }).html("&gt;_&lt; 啊吖!，敢踹我出门啦。。。2秒后我一定会回来的 ╮(╯▽╰)╭");
		setTimeout(function () {
			self.location.reload();
		}, 2000);
	}
}

//#endregion

//#region -----------------主框架----------------------

function injectMainPageFunction() {
	//资源
	var main = $("#main")[0];
	main.onload = function () {
		var location = null;
		try {
			location = main.contentWindow.location + '';
		} catch (e) {
			//出错了，跨站
		}
		if (!location || location == "http://www.12306.cn/mormhweb/logFiles/error.html") {
			resubmitForm();
		}
	}

	if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
		alert("请启用通告，不然提交会变慢！");
	}

	window.resubmitForm = function () {
		var form = $("#orderForm");
		if (form.length == 0) return;

		utility.notify("页面出错了！正在重新预定！");
		setTimeout(function () { document.getElementById("orderForm").submit(); }, 3000);
	}
	window.playAudio = function () {
		new Audio(utility.getAudioUrl()).play();
	};
	window.playFailAudio = function () {
		utility.playFailAudio();
	};
}

//#endregion

//#region -----------------自动提交----------------------
function initAutoCommitOrder() {
	var count = 0;
	var breakFlag = 0;
	var randCode = "";
	var submitFlag = false;
	var tourFlag = 'dc';

	//启用日志
	utility.enableLog();

	//#region 如果系统出错，那么重新提交

	if ($(".error_text").length > 0 && parent.$("#orderForm").length > 0) {
		parent.resubmitForm();

		return;
	}

	//#endregion

	//获得tourflag
	(function () {
		/'(dc|fc|wc|gc)'/.exec($("div.tj_btn :button:eq(2)")[0].onclick + '');
		tourFlag = RegExp.$1;
	})();

	function stop(msg) {
		setCurOperationInfo(false, "错误 - " + msg);
		setTipMessage(msg);
		$("div.tj_btn button, div.tj_btn input").each(function () {
			this.disabled = false;
			$(this).removeClass().addClass("long_button_u");
		});
		$("#btnCancelAuto").hide();
	}

	var reloadCode = function () {
		$("#img_rrand_code").click();
		$("#rand")[0].select();
	};

	var getSleepTime = function () {
		return 1000 * Math.max(parseInt($("#pauseTime").val()), 1);
	};

	//订单等待时间过久的警告
	var waitTimeTooLong_alert = false;

	function submitForm() {
		stopCheckCount();
		if (!window.submit_form_check || !submit_form_check("confirmPassenger")) {
			setCurOperationInfo(false, "您的表单没有填写完整!");
			stop("请填写完整表单");
			return;
		}

		count++;
		setCurOperationInfo(true, "第 " + count + " 次提交");
		if (breakFlag) {
			stop("已取消自动提交");
			breakFlag = 0;
			return;
		}
		$("#btnCancelAuto").show().removeClass().addClass("long_button_u_down")[0].disabled = false; //阻止被禁用
		breakFlag = 0;
		waitTimeTooLong_alert = false;

		$("#confirmPassenger").ajaxSubmit({
			url: 'confirmPassengerAction.do?method=checkOrderInfo&rand=' + $("#rand").val(),
			type: "POST",
			data: { tFlag: tourFlag },
			dataType: "json",
			success: function (data) {
				if ('Y' != data.errMsg || 'N' == data.checkHuimd || 'N' == data.check608) {
					setCurOperationInfo(false, data.msg || data.errMsg);
					stop(data.msg || data.errMsg);
					reloadCode();
				}
				else {
					jQuery.ajax({
						url: '/otsweb/order/confirmPassengerAction.do?method=confirmSingleForQueueOrder',
						data: $('#confirmPassenger').serialize(),
						type: "POST",
						timeout: 30000,
						dataType: 'json',
						success: function (msg) {
							console.log(msg);

							var errmsg = msg.errMsg;
							if (errmsg != 'Y') {
								if (errmsg.indexOf("包含未付款订单") != -1) {
									alert("您有未支付订单! 等啥呢, 赶紧点确定支付去.");
									window.location.replace("/otsweb/order/myOrderAction.do?method=queryMyOrderNotComplete&leftmenu=Y");
									return;
								}
								if (errmsg.indexOf("重复提交") != -1) {
									console.log("TOKEN失效，刷新Token中....");
									reloadToken();
									return;
								}
								if (errmsg.indexOf("包含排队中") != -1) {
									console.log("惊现排队中的订单， 进入轮询状态");
									waitingForQueueComplete();
									return;
								}

								setCurOperationInfo(false, errmsg);
								stop(errmsg);
								reloadCode();
							} else {
								utility.notifyOnTop("订单提交成功, 正在等待队列完成操作，请及时注意订单状态");
								waitingForQueueComplete();
							}
						},
						error: function (msg) {
							setCurOperationInfo(false, "当前请求发生错误");
							utility.delayInvoke(null, submitForm, 3000);
						}
					});
				}
			},
			error: function (msg) {
				setCurOperationInfo(false, "当前请求发生错误");
				utility.delayInvoke(null, submitForm, 3000);
			}
		});
	}

	function reloadToken() {
		setCurOperationInfo(true, "正在刷新TOKEN....");
		utility.post("/otsweb/order/confirmPassengerAction.do?method=init", null, "text", function (text) {
			if (!/TOKEN"\s*value="([a-f\d]+)"/i.test(text)) {
				setCurOperationInfo(false, "无法获得TOKEN，正在重试");
				utility.delayInvoke("#countEle", reloadToken, 1000);
			} else {
				var token = RegExp.$1;
				setCurOperationInfo(false, "已获得TOKEN - " + token);
				console.log("已刷新TOKEN=" + token);
				$("input[name=org.apache.struts.taglib.html.TOKEN]").val(token);
				submitForm();
			}
		}, function () { utility.delayInvoke("#countEle", reloadToken, 1000); });
	}

	function waitingForQueueComplete() {
		setCurOperationInfo(true, "订单提交成功, 正在等待队列完成操作....");

		$.ajax({
			url: '/otsweb/order/myOrderAction.do?method=getOrderWaitTime&tourFlag=' + tourFlag + '&' + Math.random(),
			data: {},
			type: 'GET',
			timeout: 30000,
			dataType: 'json',
			success: function (json) {
				console.log(json);

				if (json.waitTime == -1 || json.waitTime == 0) {
					utility.notifyOnTop("订票成功!");
					if (json.orderId)
						window.location.replace("/otsweb/order/confirmPassengerAction.do?method=payOrder&orderSequence_no=" + json.orderId);
					else window.location.replace('/otsweb/order/myOrderAction.do?method=queryMyOrderNotComplete&leftmenu=Y');
				} else if (json.waitTime == -3) {
					var msg = "很抱歉, 铁道部无齿地撤销了您的订单, 赶紧重新下!";
					utility.notify(msg);
					setCurOperationInfo(false, msg);
					stop(msg);
					reloadCode();
				} else if (json.waitTime == -2) {
					var msg = "很抱歉, 铁道部说您占座失败 : " + json.msg + ', 赶紧重新来过!';
					utility.notify(msg);
					setCurOperationInfo(false, msg);
					stop(msg);
					reloadCode();
				}
				else if (json.waitTime < 0) {
					var msg = '很抱歉, 未知的状态信息 : waitTime=' + json.waitTime + ', 可能已成功，请验证未支付订单.';
					setTipMessage(msg);
					utility.notifyOnTop(msg);
					location.href = '/otsweb/order/myOrderAction.do?method=queryMyOrderNotComplete&leftmenu=Y';
				} else {
					var msg = "订单需要 " + utility.getSecondInfo(json.waitTime) + " 处理完成， 请等待，不过你知道的，铁道部说的一直不怎么准。（排队人数=" + (json.waitCount || "未知") + "）";
					if (json.waitTime > 1800) {
						msg += "<span style='color:red; font-weight: bold;'>警告：排队时间大于30分钟，请不要放弃电话订票或用小号重新排队等其它方式继续订票！</span>";
					}
					setTipMessage(msg);

					if (json.waitTime > 1800 && !waitTimeTooLong_alert) {
						waitTimeTooLong_alert = true;
						utility.notifyOnTop("警告！排队时间大于30分钟，成功率较低，请尽快电话订票或用小号重新排队！");
					}

					utility.delayInvoke("#countEle", waitingForQueueComplete, 1000);
				}
			},
			error: function (json) {
				utility.notifyOnTop("请求发生异常，可能是登录状态不对，请验证。如果没有问题，请手动进入未完成订单页面查询。");
				self.location.reload();
			}
		});
	}


	$("div.tj_btn").append("<button class='long_button_u_down' type='button' id='btnAutoSubmit'>自动提交</button> <button class='long_button_u_down' type='button' id='btnCancelAuto' style='display:none;'>取消自动</button>");
	$("#btnAutoSubmit").click(function () {
		count = 0;
		breakFlag = 0;
		submitFlag = true;
		submitForm();
	});
	$("#btnCancelAuto").click(function () {
		$(this).hide();
		breakFlag = 1;
		submitFlag = false;
	});
	$("#rand").keyup(function (e) {
		if (!submitFlag && !document.getElementById("autoStartCommit").checked) return;

		if (e.charCode == 13 || $("#rand").val().length == 4) submitForm();
	});

	//清除上次保存的预定信息
	if (parent) {
		parent.$("#orderForm").remove();
	}

	//进度提示框
	$("table.table_qr tr:last").before("<tr><td style='border-top:1px dotted #ccc;height:100px;' colspan='9' id='orderCountCell'></td></tr><tr><td style='border-top:1px dotted #ccc;' colspan='9'><ul id='tipScript'>" +
	"<li class='fish_clock' id='countEle' style='font-weight:bold;'>等待操作</li>" +
	"<li style='color:green;'><strong>操作信息</strong>：<span>休息中</span></li>" +
	"<li style='color:green;'><strong>最后操作时间</strong>：<span>--</span></li></ul></td></tr>");

	var tip = $("#tipScript li");
	var count = 1;
	var errorCount = 0;

	//以下是函数
	function setCurOperationInfo(running, msg) {
		var ele = $("#countEle");
		ele.removeClass().addClass(running ? "fish_running" : "fish_clock").html(msg || (running ? "正在操作中……" : "等待中……"));
	}

	function setTipMessage(msg) {
		tip.eq(2).find("span").html(utility.getTimeInfo());
		tip.eq(1).find("span").html(msg);
	}

	//提交频率差别
	$(".table_qr tr:last").before("<tr><td colspan='9'>自动提交失败时休息时间：<input type='text' size='4' class='input_20txt' style='text-align:center;' value='3' id='pauseTime' />秒 (不得低于1)  <label><input type='checkbox' id='autoStartCommit' /> 输入验证码后立刻开始自动提交</label> <label><input type='checkbox' id='showHelp' /> 显示帮助</label></td></tr>");
	document.getElementById("autoStartCommit").checked = typeof (window.localStorage["disableAutoStartCommit"]) == 'undefined';
	document.getElementById("showHelp").checked = typeof (window.localStorage["disableAutoStartCommit"]) != 'undefined';
	$("#autoStartCommit").change(function () {
		if (this.checked) window.localStorage.removeItem("disableAutoStartCommit");
		else window.localStorage.setItem("disableAutoStartCommit", "1");
	});
	$("#showHelp").change(function () {
		if (this.checked) {
			window.localStorage.setItem("showHelp", "1");
			$("table.table_qr tr:last").show();
		}
		else {
			window.localStorage.removeItem("showHelp");
			$("table.table_qr tr:last").hide();
		}
	}).change();

	//#region 自动刷新席位预定请求数

	var stopCheckCount = null;

	(function () {
		var data = { train_date: $("#start_date").val(), station: $("#station_train_code").val(), seat: "", from: $("#from_station_telecode").val(), to: $("#to_station_telecode").val(), ticket: $("#left_ticket").val() };
		var url = "confirmPassengerAction.do?method=getQueueCount";
		var allSeats = $("#passenger_1_seat option");
		var queue = [];
		var checkCountStopped = false;

		function beginCheck() {
			if (checkCountStopped) return;

			var html = [];
			html.push("当前实时排队状态（每隔2秒轮询）：");


			allSeats.each(function () {
				queue.push({ id: this.value, name: this.text });
				html.push("席位【<span style='color:blue; font-weight: bold;'>" + this.text + "</span>】状态：<span id='queueStatus_" + this.value + "'>等待查询中....</span>");
			});
			$("#orderCountCell").html(html.join("<br />"));
			if (queue.length > 0) executeQueue();
		}
		function checkTicketAvailable() {
			var queryLeftData = {
				'orderRequest.train_date': $('#start_date').val(),
				'orderRequest.from_station_telecode': $('#from_station_telecode').val(),
				'orderRequest.to_station_telecode': $('#to_station_telecode').val(),
				'orderRequest.train_no': $('#train_no').val(),
				'trainPassType': 'QB',
				'trainClass': 'QB#D#Z#T#K#QT#',
				'includeStudent': 00,
				'seatTypeAndNum': '',
				'orderRequest.start_time_str': '00:00--24:00'
			};
			utility.get("/otsweb/order/querySingleAction.do?method=queryLeftTicket", queryLeftData, "text", function (text) {
				window.ticketAvailable = '';
				if (/(([\da-zA-Z]\*{5,5}\d{4,4})+)/gi.test(text)) {
					window.ticketAvailable = RegExp.$1;
				}
			}, function () { });
		}
		function executeQueue() {
			if (checkCountStopped) return;

			var type = queue.shift();
			queue.push(type);

			data.seat = type.id;
			var strLeftTicket = '';
			checkTicketAvailable();
			if (window.ticketAvailable) {
				strLeftTicket = window.ticketAvailable;
			}
			utility.get(url, data, "json", function (data) {
				var msg = "余票：<strong>" + getTicketCountDesc(strLeftTicket, type.id) + "</strong>";
				msg += "，当前排队【<span style='color:blue; font-weight: bold;'>" + data.count + "</span>】，";
				if (data.op_2) {
					msg += "<span style='color:blue; font-weight: red;'>排队人数已经超过余票数，可能无法提交</span>。";
				} else {
					if (data.countT > 0) {
						msg += "排队人数已超过系统参数，<span style='color:red; font-weight: bold;'>排队有危险</span>";
						//} else if (data.op_1) {
						//	msg += "排队人数已超过系统参数，<span style='color:red; font-weight: bold;'>排队有危险</span>";
					} else {
						msg += "请尽快提交";
					}

				}
				msg += "&nbsp;&nbsp;&nbsp;&nbsp;(" + utility.getTimeInfo() + ")";

				$("#queueStatus_" + type.id).html(msg);
				setTimeout(executeQueue, 2000);
			}, function () {
				setTimeout(executeQueue, 3000);
			});
		}

		stopCheckCount = function () {
			checkCountStopped = true;
		}

		beginCheck();
	})();

	//#endregion


	//#region 自动选择联系人、自动选择上次选择的人
	function autoSelectPassenger() {
		var pp = localStorage.getItem("preSelectPassenger") || "";
		var pseat = localStorage.getItem("autoSelect_preSelectSeatType") || "";
		if (pp) {
			pp = pp.split("|");

			$.each(pp, function () {
				if (!this) return true;
				console.log("[INFO][自动选择乘客] 自动选定-" + this);
				$("#" + this + "._checkbox_class").attr("checked", true).click().attr("checked", true);	//为啥设置两次？我也不知道，反正一次不对。
				return true;
			});
			if (pseat) {
				$(".passenger_class").each(function () { $(this).find("select:eq(0)").val(pseat).change(); });
			}
		}
	};

	$(window).ajaxComplete(function (e, xhr, s) {
		if (s.url.indexOf("getpassengerJson") != -1) {
			console.log("[INFO][自动选择乘客] 系统联系人加载完成，正在检测预先选定");
			autoSelectPassenger();
		}
	});
	//如果已经加载完成，那么直接选定
	if ($("#showPassengerFilter div").length) {
		console.log("[INFO][自动选择乘客] OOPS，居然加载完成了？直接选定联系人");
		autoSelectPassenger();
	}
	//#endregion

	//#region 自动定位到随机码中

	(function () {
		var obj = document.getElementById("rand");

		var oldOnload = window.onload;
		window.onload = function () {
			if (oldOnload) oldOnload();
			obj.select();
		};
		obj.select();
	})();

	//#endregion

	//#region 显示内部的选择上下铺

	(function () {
		var seatSelector = $("select[name$=_seat]");
		seatSelector.change(function () {
			var self = $(this);
			var val = self.val();
			var l = self.next();

			if (val == "2" || val == "3" || val == "4" || val == "6") {
				l.show();
			} else
				l.hide();
			var preseat = utility.getPref("preselectseatlevel");
			if (preseat) {
				l.val(preseat).change();
			}
		}).change();

	})();

	//#endregion
}

function autoCommitOrderInSandbox() {
	//自动提示？
	if (window.localStorage["bookTip"]) {
		window.localStorage.removeItem("bookTip");
		if (window.Audio) {
			new window.Audio(utility.getAudioUrl()).play();
		}
		utility.notify("已经自动进入订票页面！请继续完成订单！");
	}
}

//#endregion

//#region -----------------自动刷新----------------------

function initTicketQuery() {
	//启用日志
	utility.enableLog();

	//#region 参数配置和常规工具界面

	var queryCount = 0;
	var timer = null;
	var isTicketAvailable = false;
	var audio = null; //通知声音
	var timerCountDown = 0;
	var timeCount = 0;
	var autoBook = false;
	//初始化表单
	var form = $("form[name=querySingleForm] .cx_from:first");
	form.find("tr:last").after("<tr class='append_row'><td colspan='9' id='queryFunctionRow'><label><input type='checkbox' id='keepinfo' checked='checked' />记住信息</label> <label><input checked='checked' type='checkbox' id='autoRequery' />自动重新查询</label>，查询周期(S)：<input type='text' value='6' size='4' id='refereshInterval' style='text-align:center;' />(不得小于6) " +
		"<label><input type='checkbox' checked='checked' id='chkAudioOn'>声音提示</label> <input type='button' id='chkSeatOnly' value='仅座票' class='lineButton' /> <input type='button' id='chkSleepOnly' value='仅卧铺' class='lineButton' />" +
		"<input type='button' id='enableNotify' onclick='window.webkitNotifications.requestPermission();' value='请点击以启用通告' style='line-height:25px;padding:5px;' /> <span id='refreshinfo'>已刷新 0 次，最后查询：--</span> <span id='refreshtimer'></span></td></tr>" +
		"<tr class='append_row'><td colspan='9'><input type='checkbox' checked='checked' id='chkAudioLoop'>声音循环</label>" +
		"<span style='font-weight:bold;margin-left:10px;color:blue;'><label><input type='checkbox' id='chkAutoResumitOrder' checked='checked' />预定失败时自动重试</label></span>" +
		"<span style='font-weight:bold;margin-left:10px;color:blue;'><label><input type='checkbox' id='chkAutoRequery' checked='checked' />查询失败时自动重试</label></span>" +
		"</td></tr>" +
		"<tr class='append_row'><td id='filterFunctionRow' colspan='9'>" +
		"<span style='font-weight:bold;color:red;'><label><input type='checkbox' id='chkFilterNonBookable' />过滤不可预订的车次</label></span>" +
		"<span style='font-weight:bold;margin-left:10px;color:red;'><label><input type='checkbox' id='chkFilterNonNeeded' />过滤不需要的席别</label></span>" +
		"<span style='font-weight:bold;margin-left:10px;color:blue;display: none;'><label><input disabled='disabled' type='checkbox' id='chkFilterByTrain' />开启按车次过滤</label></span>" +
		"</td></tr>" +
		"<tr><td colspan='9' id='opFunctionRow'><input style='line-height:25px;padding:5px;' disabled='disabled' type='button' value='停止声音' id='btnStopSound' /><input style='line-height:25px;padding:5px;' disabled='disabled'  type='button' value='停止刷新' id='btnStopRefresh' /><input style='line-height:25px;padding:5px;' type='button' value='设置' id='configLink' /><span style='margin-left:20px;color:purple;font-weight:bold;' id='serverMsg'></span></td> </tr>"
	);

	if (!window.Audio) {
		$("#chkAudioOn, #chkAudioLoop, #btnStopSound").remove();
	} else {
		$("#btnStopSound").click(function () {
			if (audio) {
				audio.pause();
			}
			this.disabled = true;
		});
	}

	//操作控制
	$("#btnStopRefresh").click(function () { resetTimer(); });

	//#endregion

	//#region 显示座级选择UI
	var ticketType = new Array();
	$(".hdr tr:eq(2) td").each(function (i, e) {
		ticketType.push(false);
		if (i < 3) return;

		var obj = $(this);
		ticketType[i] = (window.localStorage["typefilter_" + i] || "true") == "true";

		//修改文字，避免换行
		obj.attr("otext", obj.text());
		var cap = $.trim(obj.text());
		if (cap.length > 2) {
			cap = cap.replace("座", "").replace("高级软卧", "高软");
			obj.html(cap);
		}

		//加入复选框
		var c = $("<input/>").attr("type", "checkBox").attr("checked", ticketType[i]);
		c[0].ticketTypeId = i;
		c.change(
			function () {
				ticketType[this.ticketTypeId] = this.checked;
				window.localStorage["typefilter_" + this.ticketTypeId] = this.checked;
			}).appendTo(obj);
	});

	//座级选择
	$("#chkSeatOnly").click(function () {
		$(".hdr tr:eq(2) td").each(function (i, e) {
			var obj = $(this);
			var txt = obj.attr("otext");
			obj.find("input").attr("checked", typeof (txt) != 'undefined' && txt && txt.indexOf("座") != -1).change();
		});
	});
	$("#chkSleepOnly").click(function () {
		$(".hdr tr:eq(2) td").each(function (i, e) {
			var obj = $(this);
			var txt = obj.attr("otext");
			obj.find("input").attr("checked", typeof (txt) != 'undefined' && txt && txt.indexOf("卧") != -1).change();
		});
	});
	//#endregion

	//#region 显示额外的功能区
	var extrahtml = [];
	extrahtml.push("<div class='outerbox' id='helperbox'><div class='box'><div class='title'>辅助工具 [<a href='#querySingleForm'>返回订票列表</a>]</div><div class='content'>\
<table id='helpertooltable'><tr><td colspan='4'><input type='button' value='添加自定义车票时间段' id='btnDefineTimeRange' />\
<input type='button' value='清除自定义车票时间段' id='btnClearDefineTimeRange' /></td></tr>\
<tr class='fish_sep caption'><td colspan='4'>以下是车次过滤以及自动预定列表。要将车次加入下列的列表，请在上面查询的结果中，将鼠标移动到车次链接上，并点击出现的提示框中的过滤或自动预定按钮。</td></tr>\
		<tr class='fish_sep'><td><label><input type='checkbox' id='swBlackList' checked='checked' name='swBlackList' /><strong>车次黑名单</strong></label><br /><span style='color:gray;'>指定车次将会<br />被从列表中过<br />滤，不再出现</span></td><td><select id='blackList' style='width:200px;height:100px;' size='10' multiple='multiple'></select><input type='button' value='增加' class='btn_list_add' /><input type='button' value='删除' class='btn_list_delete' /><input type='button' class='btn_list_clear' value='清空' /></td>\
		<td><label><input type='checkbox' id='swAutoBook' name='swAutoBook' checked='checked' /><strong>自动预定</strong></label><br /><span style='color:gray;'>指定车次可用<br />时，将会自动<br />进入预定页面</td><td><select id='autoBookList' size='10' style='width:200px;height:100px;' multiple='multiple'></select><input type='button' value='增加' class='btn_list_add' /><input type='button' class='btn_list_delete' value='删除' /><input type='button' class='btn_list_clear' value='清空' /></td></tr>\
<tr class='fish_sep'><td colspan='4'><label><input type='checkbox' id='autoBookTip' checked='checked' /> 如果自动预定成功，进入预定页面后播放提示音乐并弹窗提示</label></td></tr>\
<tr class='fish_sep caption'><td colspan='4'>相关设置</td></tr>\
<tr class='fish_sep musicFunc'><td class='name'>自定义音乐地址</td><td colspan='3'><input type='text' id='txtMusicUrl' value='" + utility.getAudioUrl() + "' onfocus='this.select();' style='width:50%;' /> <input type='button' onclick='new Audio(document.getElementById(\"txtMusicUrl\").value).play();' value='测试'/><input type='button' onclick='utility.resetAudioUrl(); document.getElementById(\"txtMusicUrl\").value=utility.getAudioUrl();' value='恢复默认'/> (地址第一次使用可能会需要等待一会儿)</td></tr>\
<tr class='fish_sep musicFunc'><td class='name'>可用音乐地址</td><td colspan='3'>");

	var host = navigator.userAgent.indexOf("WebKit") != -1 ? "http://resbak.fishlee.net/res/" : "https://github.com/iccfish/12306_ticket_helper/raw/master/res/";
	var musics = [[host + "music1.ogg", "超级玛丽"], [host + "music2.ogg", "蓝精灵"]];
	$.each(musics, function () {
		extrahtml.push("<a href='javascript:;' url='" + this[0] + "' class='murl'>" + this[1] + "</a>&nbsp;&nbsp;&nbsp;&nbsp;");
	});

	extrahtml.push("</td></tr>\
<tr class='fish_sep'><td style='text-align:center;' colspan='4'>12306.CN 订票助手 by iFish(木鱼) | <a href='http://t.qq.com/ccfish/' target='_blank' style='color:blue;'>腾讯微博</a> | <a href='http://www.fishlee.net/soft/44/' style='color:blue;' target='_blank'>助手主页</a> | <a href='http://www.fishlee.net/Discussion/Index/44' target='_blank'>反馈BUG</a> | <a style='font-weight:bold;color:red;' href='http://www.fishlee.net/soft/44/donate.html' target='_blank'>捐助作者</a> | 版本 v" + window.helperVersion + "，许可于 <strong>" + utility.regInfo.name + "，类型 - " + utility.regInfo.typeDesc + "</strong> 【<a href='javascript:;' class='reSignHelper'>重新注册</a>】</td></tr>\
		</table></div></div></div>");

	$("body").append(extrahtml.join(""));
	$("a.murl").live("click", function () {
		$("#txtMusicUrl").val(this.getAttribute("url")).change();
	});
	$("#stopBut").before("<div class='jmp_cd' style='text-align:center;'><button class='fish_button' id='btnFilter'>加入黑名单</button><button class='fish_button' id='btnAutoBook'>自动预定本车次</button></div>");
	$("#txtMusicUrl").change(function () { window.localStorage["audioUrl"] = this.value; });
	$("form[name=querySingleForm]").attr("id", "querySingleForm");
	$("#swBlackList, #swAutoBook").each(function () {
		var obj = $(this);
		var name = obj.attr("name");

		var opt = localStorage.getItem(name);
		if (opt != null) this.checked = opt == "1";
	}).change(function () {
		var obj = $(this);
		var name = obj.attr("name");

		localStorage.setItem(name, this.checked ? "1" : "0");
	});

	//#endregion

	//#region 添加自定义时间段
	function addCustomTimeRange() {
		var s = parseInt(prompt("请输入自定义时间段的起始时间（请填入小时，0-23）", "0"));
		if (isNaN(s) || s < 0 || s > 23) {
			alert("起始时间不正确 >_<"); return;
		}
		var e = parseInt(prompt("请输入自定义时间段的结束时间（请填入小时，1-24）", "24"));
		if (isNaN(e) || e < 0 || e > 24) {
			alert("结束时间不正确 >_<"); return;
		}
		var range = (s > 9 ? "" : "0") + s + ":00--" + (e > 9 ? "" : "0") + e + ":00";
		if (confirm("您想要记住这个时间段吗？")) {
			window.localStorage["customTimeRange"] = (window.localStorage["customTimeRange"] ? window.localStorage["customTimeRange"] + "|" : "") + range;
		};
		addCustomeTimeRangeToList(range);
	}
	function addCustomeTimeRangeToList(g) {
		var obj = document.getElementById("startTime");
		obj.options[obj.options.length] = new Option(g, g);
		obj.selectedIndex = obj.options.length - 1;
	}
	if (window.localStorage["customTimeRange"]) {
		var ctrs = window.localStorage["customTimeRange"].split("|");
		$.each(ctrs, function () { addCustomeTimeRangeToList(this); });
	}
	$("#btnClearDefineTimeRange").click(function () {
		if (!confirm("确定要清除自定义的时间段吗？清除后请刷新页面。")) return;
		window.localStorage.removeItem("customTimeRange");
	});
	$("#btnDefineTimeRange").click(addCustomTimeRange);
	//#endregion

	//#region 过滤车次
	var stopHover = window.onStopHover;
	window.onStopHover = function (info) {
		$("#stopDiv").attr("info", $.trim($("#id_" + info.split('#')[0]).text()));
		stopHover.call(this, info);
		$("#onStopHover").css("overflow", "hide");
	};
	$("input.btn_list_add").click(function () {
		var no = prompt("请输入要添加的车次，可以使用正则表达式填写（如果不会正则表达式，请老实填车次……）");
		if (!no) return;

		try {
			new RegExp(no);
		} catch (e) {
			alert("嗯……看起来同学您输入的不是正确的正则表达式哦。");
			return;
		}

		var btn = $(this);
		var list = btn.prevAll().filter("select");
		utility.addOption(list[0], no, no);
		utility.saveList("blackList");

		utility.saveList(list.attr("id"));
	});
	$("input.btn_list_clear").click(function () {
		if (!confirm("确定清空车次列表？")) return;

		var btn = $(this);
		var list = btn.prevAll().filter("select");
		list[0].options.length = 0;

		utility.saveList(list.attr("id"));
	});
	$("input.btn_list_delete").click(function () {
		if (!confirm("确定从列表中删除指定车次？")) return;

		var btn = $(this);
		var list = btn.prevAll().filter("select");
		var arr = list.val();
		var dom = list[0];
		for (var i = dom.options.length - 1; i >= 0; i--) {
			if ($.inArray(dom.options[i].value, arr) != -1) {
				dom.options[i] = null;
			}
		}

		utility.saveList(list.attr("id"));
	});
	utility.loadList("blackList");
	utility.loadList("autoBookList");

	var blackListDom = document.getElementById("blackList");
	var autoBookDom = document.getElementById("autoBookList");
	$("#btnFilter").click(function () {
		//加入黑名单
		var trainNo = $("#stopDiv").attr("info").split('#')[0];
		if (!trainNo || !confirm("确定要将车次【" + trainNo + "】加入黑名单？以后的查询将不再显示此车次。")) return;

		utility.addOption(blackListDom, trainNo, trainNo);
		utility.saveList("blackList");
	});
	$("#btnAutoBook").click(function () {
		//加入自动预定列表
		var trainNo = $("#stopDiv").attr("info").split('#')[0];
		if (!trainNo || !confirm("确定要将车次【" + trainNo + "】加入自动预定列表？如果下次查询有符合要求的席别将会自动进入预定页面。")) return;

		if (utility.inOptionList(blackListDom, trainNo)) {
			alert("指定的车次在黑名单里呢……");
			return;
		}

		utility.addOption(autoBookDom, trainNo, trainNo);
		utility.saveList("autoBookList");
	});
	//清除进入指定页面后提示的标记位
	if (window.localStorage["bookTip"]) window.localStorage.removeItem("bookTip");
	//#endregion

	//#region 自动重新查询

	var clickButton = null;//点击的查询按钮
	var filterNonBookable = $("#chkFilterNonBookable")[0];	//过滤不可定车次
	var filterNonNeeded = $("#chkFilterNonNeeded")[0];	//过滤不需要车次
	var onRequery = function () { };	//当重新查询时触发
	var onNoTicket = function () { };	//当没有查到票时触发

	$("#autoRequery").change(function () {
		if (!this.checked)
			resetTimer();
	});
	//刷新时间间隔
	$("#refereshInterval").change(function () { timeCount = Math.max(6, parseInt($("#refereshInterval").val())); }).change();

	//定时查询
	function resetTimer() {
		queryCount = 0;
		$("#btnStopRefresh")[0].disabled = true;
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		$("#refreshtimer").html("");
	}

	function countDownTimer() {
		timerCountDown--;
		$("#refreshtimer").html(" 【" + timerCountDown + "秒后自动查询...】");

		if (timerCountDown > 0) return;

		clearInterval(timer);
		timer = null;
		onRequery();
		doQuery();
	}

	function startTimer() {
		if (timer) return;

		timerCountDown = timeCount;
		$("#refreshtimer").html(" 【" + timerCountDown + "秒后自动查询...】");
		//没有定时器的时候，开启定时器准备刷新
		$("#btnStopRefresh")[0].disabled = false;
		timer = setInterval(countDownTimer, 1000);
	}

	function displayQueryInfo() {
		queryCount++;
		$("#refreshinfo").html("已刷新 " + queryCount + " 次，最后查询：" + utility.getTimeInfo());
		$("#refreshtimer").html("正在查询");
	}

	function doQuery() {
		timer = null;
		if (audio) audio.pause();
		displayQueryInfo();
		sendQueryFunc.call(clickBuyStudentTicket == "Y" ? document.getElementById("stu_submitQuery") : document.getElementById("submitQuery"));
	}

	//验证车票有开始
	var onticketAvailable = function () {
		resetTimer();
		$("#refreshinfo").html("已经有票鸟！");

		utility.notifyOnTop("可以订票了！");
		if (window.Audio && $("#chkAudioOn")[0].checked) {
			if (!audio) {
				audio = new Audio($("#txtMusicUrl").val());
			}
			audio.loop = $("#chkAudioLoop")[0].checked;
			$("#btnStopSound")[0].disabled = false;
			audio.play();
		}
	}
	//检查是否可以订票
	var checkTicketsQueue = [];
	var checkTicketCellsQueue = [];

	function getTrainNo(row) {
		/// <summary>获得行的车次号</summary>
		return $.trim($("td:eq(0)", row).text());
	}
	//默认的单元格检测函数
	checkTicketCellsQueue.push(function (i, e) {
		if (!ticketType[i - 1]) return 0;

		var el = $(e);
		var info = $.trim(el.text()); //Firefox不支持 innerText

		if (info == "*" || info == "--" || info == "无") {
			return 0;
		}
		return 2;
	});
	//默认的行检测函数
	checkTicketsQueue.push(function () {
		var trainNo = getTrainNo(this);

		this.attr("tcode", trainNo);
		//黑名单过滤
		if (document.getElementById("swBlackList").checked) {
			for (var i = 0; i < blackListDom.options.length; i++) {
				var reg = utility.getRegCache(blackListDom.options[i].value);
				if (reg.test(trainNo)) {
					console.log(trainNo + " 已经被过滤，表达式：" + blackListDom.options[i].value);
					this.hide();
					return 0;
				}
			}
		}


		var hasTicket = 1;
		if ($("a.btn130", this).length > 0) return 0;

		$("td", this).each(function (i, e) {
			var cellResult = 0;
			e = $(e);
			$.each(checkTicketCellsQueue, function () {
				cellResult = this(i, e, cellResult) || cellResult;
				return cellResult != 0;
			});
			if (cellResult == 2) {
				hasTicket = 2;
				e.css("background-color", "#95AFFD");
			}
		});

		return hasTicket;
	});

	//检测是否有余票的函数
	var checkTickets = function () {
		var result = 0;
		var row = this;
		$.each(checkTicketsQueue, function () {
			result = this.call(row, result);

			return true;
		});

		return result;
	}

	//目标表格，当ajax完成时检测是否有票
	$("body").ajaxComplete(function (e, r, s) {
		//HACK-阻止重复调用
		if (timer != null) return;

		if (s.url.indexOf("queryLeftTicket") == -1)
			return;

		//验证有票
		var rows = $("table.obj tr:gt(0)");
		var ticketValid = false;
		var validRows = {};
		rows.each(function () {
			var row = $(this);
			var valid = checkTickets.call(row);
			var code = getTrainNo(row);

			row.attr("tcode", code);

			console.log("[INFO][车票可用性校验] " + code + " 校验结果=" + valid);

			if (valid == 2) {
				row.css("background-color", "#FD855C");
				validRows[code] = row;
			}
			else {
				if (valid == 1 && filterNonNeeded.checked) row.hide();
				if (valid == 0 && filterNonBookable.checked) row.hide();
			}
			ticketValid = ticketValid || valid == 2;
		});

		//自动预定
		if ($("#swAutoBook:checked").length > 0) {
			$("#autoBookList option").each(function () {
				var reg = utility.getRegCache(this.text);
				var row = $.first(validRows, function (i, v) {
					if (reg.test(i)) return v;
				});

				if (row) {
					if (document.getElementById("autoBookTip").checked) {
						window.localStorage["bookTip"] = 1;
					}
					row.find("a[name=btn130_2]").click();

					return false;
				}
			})
		}

		if (ticketValid) {
			onticketAvailable();
		} else if (document.getElementById("autoRequery").checked) {
			onNoTicket();
			startTimer();
		}
	});

	//系统繁忙时自动重复查询 chkAutoResumitOrder
	$("#orderForm").submit(function () {
		if ($("#chkAutoResumitOrder")[0].checked) {
			parent.$("#orderForm").remove();
			parent.$("body").append($("#orderForm").clone(false).attr("target", "main"));
		}
	});
	$("body").ajaxComplete(function (e, r, s) {
		if (!$("#chkAutoRequery")[0].checked) return;
		if (s.url.indexOf("/otsweb/order/querySingleAction.do") != -1 && r.responseText == "-1") {
			//invalidQueryButton();
			//delayButton();
			//startTimer();
		} else {
			$("#serverMsg").html("");
		}
	});
	$("body").ajaxError(function (e, r, s) {
		if (s.url.indexOf("queryLeftTicket") == -1) return;
		if (!$("#chkAutoRequery")[0].checked) return;
		if (s.url.indexOf("/otsweb/order/querySingleAction.do") != -1) {
			delayButton();
			startTimer();
		}
	});

	//Hack掉原来的系统函数。丫居然把所有的click事件全部处理了，鄙视
	window.invalidQueryButton = function () {
		var queryButton = $("#submitQuery");
		queryButton.unbind("click", sendQueryFunc);
		if (queryButton.attr("class") == "research_u") {
			renameButton("research_x");
		} else if (queryButton.attr("class") == "search_u") {
			renameButton("search_x");
		}
	}
	//#endregion

	//#region 配置加载、保存、权限检测
	//通知权限
	if (!window.webkitNotifications || window.webkitNotifications.checkPermission() == 0) {
		$("#enableNotify").remove();
	}

	//保存信息
	function saveStateInfo() {
		if (!$("#keepinfo")[0].checked || $("#fromStationText")[0].disabled) return;
		utility.setPref("_from_station_text", $("#fromStationText").val());
		utility.setPref("_from_station_telecode", $("#fromStation").val());
		utility.setPref("_to_station_text", $("#toStationText").val());
		utility.setPref("_to_station_telecode", $("#toStation").val());
		utility.setPref("_depart_date", $("#startdatepicker").val());
		utility.setPref("_depart_time", $("#startTime").val());
	}

	$("#submitQuery, #stu_submitQuery").click(saveStateInfo);
	//回填信息
	if (!$("#fromStationText")[0].disabled) {
		var FROM_STATION_TEXT = utility.getPref('_from_station_text');  // 出发站名称
		var FROM_STATION_TELECODE = utility.getPref('_from_station_telecode');  // 出发站电报码
		var TO_STATION_TEXT = utility.getPref('_to_station_text');  // 到达站名称
		var TO_STATION_TELECODE = utility.getPref('_to_station_telecode');  // 到达站电报码
		var DEPART_DATE = utility.getPref('_depart_date');  // 出发日期
		var DEPART_TIME = utility.getPref('_depart_time'); // 出发时间

		if (FROM_STATION_TEXT) {
			$("#fromStationText").val(FROM_STATION_TEXT);
			$("#fromStation").val(FROM_STATION_TELECODE);
			$("#toStationText").val(TO_STATION_TEXT);
			$("#toStation").val(TO_STATION_TELECODE);
			$("#startdatepicker").val(DEPART_DATE);
			$("#startTime").val(DEPART_TIME);
		}
	}

	//音乐
	if (!window.Audio) {
		$(".musicFunc").hide();
	}
	//#endregion

	//#region 时间快捷修改
	(function () {
		var datebox = $("table.cx_from tr:eq(0) td:eq(5), table.cx_from tr:eq(1) td:eq(3)");
		datebox.width("170px");
		datebox.find("input").width("70px").before('<input type="button" class="date_prev lineButton" value="&lt;">').after('<input type="button" class="date_next lineButton" value="&gt;">');

		datebox.find(".date_prev").click(function () { var dobj = $(this).next(); dobj.val(utility.formatDate(utility.addTimeSpan(utility.parseDate(dobj.val()), 0, 0, -1, 0, 0, 0))).change(); });
		datebox.find(".date_next").click(function () { var dobj = $(this).prev(); dobj.val(utility.formatDate(utility.addTimeSpan(utility.parseDate(dobj.val()), 0, 0, 1, 0, 0, 0))).change(); });
	})();
	//#endregion

	//#region 自动轮询，自动更改时间
	(function () {	//初始化UI
		var html = "<tr class='fish_sep' id='autoChangeDateRow'><td class='name'>查询日期</td><td>\
<label><input type='checkbox' id='autoCorrentDate' checked='checked' /> 查询日期早于或等于今天时，自动修改为明天</label>\
</td><td class='name'>自动轮查</td><td><label><input type='checkbox' id='autoChangeDate' /> 无票时自动更改日期轮查</label>\
</td></tr><tr class='fish_sep' style='display:none;'><td class='name'>轮查日期设置</td><td colspan='3' id='autoChangeDateList'></td></tr>\
	";
		$("#helpertooltable tr:last").before(html);
		var autoChangeDateList = $("#autoChangeDateList");
		var html = [];
		var now = new Date();
		for (var i = 0; i < 20; i++) {
			now = utility.addTimeSpan(now, 0, 0, 1, 0, 0, 0);
			html.push("<label style='margin-right:16px;'><input type='checkbox' value='" + utility.formatDate(now) + "' cindex='" + i + "' />" + utility.formatDateShort(now) + "</label>");
			if ((i + 1) % 10 == 0)
				html.push("<br />");
		}
		autoChangeDateList.html(html.join(""));
		$("#autoChangeDate").change(function () {
			var tr = $(this).closest("tr").next();
			if (this.checked) tr.show();
			else tr.hide();
		});
		//配置
		utility.reloadPrefs($("#autoChangeDateRow"), "autoChangeDateRow");
		//日期点选
		var stKey = "autoChangeDateRow_dates";
		var stValue = window.localStorage.getItem(stKey);
		if (typeof (stValue) != 'undefined' && stValue) {
			var array = stValue.split('|');
			autoChangeDateList.find(":checkbox").each(function () {
				this.checked = $.inArray(this.value, array) != -1;
			});
		}
		autoChangeDateList.find(":checkbox").change(function () {
			var value = $.map(autoChangeDateList.find(":checkbox:checked"), function (e, i) { return e.value; }).join("|")
			window.localStorage.setItem(stKey, value);
		});
	})();
	(function () {
		//如果当前查询日期在当前日期或之前，那么自动修改日期
		$("#startdatepicker, #roundTrainDate").change(function () {
			if (!document.getElementById("autoCorrentDate").checked) return;
			var obj = $(this);
			var val = utility.parseDate(obj.val());
			var tomorrow = utility.addTimeSpan(utility.getDate(new Date()), 0, 0, 1, 0, 0, 0);

			if (!val || isNaN(val.getFullYear()) || tomorrow > val) {
				console.log("自动修改日期为 " + utility.formatDate(tomorrow));
				obj.val(utility.formatDate(tomorrow));
			}
		}).change();
	})();
	onNoTicket = (function (callback) {
		return function () {
			//Hook onNoTicket
			callback();

			if (!document.getElementById("autoChangeDate").checked) return;
			console.log("自动轮询日期中。");

			var index = parseInt($("#autoChangeDate").attr("cindex"));
			if (isNaN(index)) index = -1;
			var current = index == -1 ? [] : $("#autoChangeDateList :checkbox:eq(" + index + ")").parent().nextAll(":has(:checked):eq(0)").find("input");
			if (current.length == 0) {
				index = 0;
				current = $("#autoChangeDateList :checkbox:checked:first");
				if (current.length == 0) return;	//没有选择任何
			}
			index = current.attr("cindex");
			if (current.length > 0) {
				$("#autoChangeDate").attr("cindex", index);
				$("#startdatepicker").val(current.val());
				//高亮
				$("#cx_titleleft span").css({ color: 'red', 'font-weight': 'bold' });
			}
		};
	}
		)(onNoTicket);
	//#endregion

	//#region 拦截弹出的提示框，比如服务器忙
	(function () {
		var _bakAlert = window.alert;
		window.alert = function (msg) {
			if (msg.indexOf("服务器忙") != -1) {
				$("#serverMsg").text(msg);
			} else _bakAlert(msg);
		}
	})();
	//#endregion

	//#region 默认加入拦截Ajax缓存
	(function () { $.ajaxSetup({ cache: false }); })();
	//#endregion

	//#region 显示所有的乘客

	(function () {
		var html = [];
		html.push("<tr class='caption'><td colspan='4'>自动添加乘客 （加入此列表的乘客将会自动在提交订单的页面中添加上，<strong>最多选五位</strong>）</td></tr>");
		html.push("<tr class='fish_sep'><td id='passengerList' colspan='4'><span style='color:gray; font-style:italic;'>联系人列表正在加载中，请稍等...</span></td></tr>");
		html.push("<tr class='fish_sep'><td class='name'>自动选定席别</td><td><select id='preSelectSeat'></select><select id='preselectseatlevel'></select>(作者无法保证上下铺选择一定有效)</td><td class='name autoordertd'><label style='display:none;'><input type='checkbox' id='autoorder'/>自动提交订单</label></td><td class='autoordertd'><p style='display:none;'><img id='randCode' src='https://dynamic.12306.cn/otsweb/passCodeAction.do?rand=randp' /> <input size='4' maxlength='4' type='text' id='randCodeTxt' /> （<span style='font-weight:bold;color:red；'>请务必阅读说明！</span>）</p></td></tr>");
		html.push("<tr style='display:none;' id='autoordertip' class='fish_sep'><td class='name' style='color:red;'>警告</td><td colspan='3' style='color:red;'>");
		html.push("<p style='font-weight:bold; color:purple;'>自动提交订单使用流程：勾选要订票的联系人 -&gt; 设置需要的席别 -&gt; 将你需要订票的车次按优先级别加入自动预定列表 -&gt; 勾选自动提交订单 -&gt; 输入验证码 -&gt; 开始查票。信息填写不完整将会导致助手忽略自动提交订单，请务必注意。</p>");
		html.push("<p>1. 自动提交订单使用的是自动预定的列表顺序，取第一个有效的车次自动提交订单！请确认设置正确（<b style='color:blue;'>强烈要求仅选择你要的席别，不要都选！</b>）；</p><p>2. 自动提交的席别和联系人请在上方选择，和预设的是一致的，暂不支持不同的联系人选择不同的席别；</p><p>3. 请务必输入验证码！</p><p>4. 作者无法保证自动提交是否会因为铁老大的修改失效，因此请务必同时使用<b>其它浏览器</b>手动提交订单！否则可能会造成您不必要的损失！</p>");
		html.push("<p style='font-weight:bold;'>5. 当助手第一次因为功能性自动提交失败后（非网络错误和验证码错误，如余票不足、占座失败等），将会立刻禁用自动提交并回滚到普通提交，并再次提交订票请求，因此请时刻注意提交结果并及时填写内容，并强烈建议你另外打开单独的浏览器同时手动下订单！！</p>");
		html.push("</td></tr>");

		$("#helpertooltable tr:first").addClass("fish_sep").before(html.join(""));

		var seatlist = [
			["", "<无设置>"],
			["9", "商务座"],
			["P", "特等座"],
			["6", "高级软卧"],
			["4", "软卧"],
			["3", "硬卧"],
			["2", "软座"],
			["1", "硬座"],
			["M", "一等座"],
			["O", "二等座"]
		];
		var level = [[0, '随机'], [3, "上铺"], [2, '中铺'], [1, '下铺']];
		var seatDom = document.getElementById("preSelectSeat");
		var seatLevelDom = document.getElementById("preselectseatlevel");
		$.each(seatlist, function () {
			seatDom.options[seatDom.options.length] = new Option(this[1], this[0]);
		});
		$.each(level, function () {
			seatLevelDom.options[seatLevelDom.options.length] = new Option(this[1], this[0]);
		});
		$(seatDom).val(window.localStorage.getItem("autoSelect_preSelectSeatType") || "").change(function () {
			window.localStorage.setItem("autoSelect_preSelectSeatType", $(this).val());
		});
		$(seatLevelDom).val(window.localStorage.getItem("preselectseatlevel") || "").change(function () {
			window.localStorage.setItem("preselectseatlevel", $(this).val());
		});
		$("#autoorder").click(function () {
			if (this.checked) {
				document.getElementById("swAutoBook").checked = true;
				alert("警告！选中将会启用自动下单功能，并取代自动预定功能，请输入验证码，当指定的车次中的指定席别可用时，助手将会为您全自动下单。\n\n请确认您设置了正确的车次和席别！\n\n但是，作者无法保证是否会因为铁道部的修改导致失效，请使用此功能的同时务必使用传统的手动下单以保证不会导致您的损失！");
			}
			document.getElementById("swAutoBook").disabled = this.checked;
			if (this.checked) $("#autoordertip").show();
			else $("#autoordertip").hide();
		});
		//禁用自动预定


		//加载乘客
		utility.getAllPassengers(function (list) {
			var h = [];
			var check = (localStorage.getItem("preSelectPassenger") || "").split('|');
			$.each(list, function () {
				var value = this.passenger_name + this.passenger_id_type_code + this.passenger_id_no;
				h.push("<label style='margin-right:10px;'><input type='checkbox' id='preSelectPassenger" + this.passenger_id_no + "' name='preSelectPassenger'" + ($.inArray(value, check) > -1 ? " checked='checked'" : "") + " value='" + value + "' />" + this.passenger_name + "</label>");
			});

			$("#passengerList").html(h.join("")).find("input").change(function () {
				var selected = $("#passengerList :checkbox:checked");
				if (selected.length > 5) {
					alert("选择的乘客不能多于五位喔~~");
					selected.filter(":gt(4)").attr("checked", false);
				} else {
					$("#ticketLimition").val(selected.length);
				}
				var user = $.map(selected.filter(":lt(5)"), function (e) { return e.value; });
				localStorage.setItem("preSelectPassenger", user.join("|"));
			});
			$.each(list, function () {
				$("#preSelectPassenger" + this.passenger_id_no).data('pasinfo', this);
			});
			$("#ticketLimition").val($("#passengerList :checkbox:checked").length);
		});
	})();


	//#endregion

	//#region 预定界面加载快速查询链接

	(function () {
		var html = [];
		html.push("<tr class='caption'><td colspan='4'>快速查询链接</strong></td></tr>");
		html.push("<tr class='fish_sep'><td colspan='4'>");

		var urls = [
			["各始发站放票时间查询", "http://www.12306.cn/mormhweb/zxdt/tlxw_tdbtz53.html"]
		];
		$.each(urls, function () {
			html.push("<div style='float:left;'><a href='" + this[1] + "' target='_blank'>" + this[0] + "</a></div>");
		});

		html.push("</td></tr>");

		$("#helpertooltable tr:first").addClass("fish_sep").before(html.join(""));
	})();

	//#endregion

	//#region 余票数限制

	(function () {
		var html = [];
		html.push("<tr class='caption'><td colspan='4'>票数限制</strong></td></tr>");
		html.push("<tr class='fish_sep'><td><strong>最小票数</strong><td colspan='3'><select id='ticketLimition'></select>");
		html.push("当剩余票数小于这里设置的值时，将不会看作有票。</td></tr>");

		$("#helpertooltable tr:first").addClass("fish_sep").before(html.join(""));
		var dom = $("#ticketLimition").val($("#passengerList :checkbox:checked").length)[0];
		for (var i = 0; i < 6; i++) {
			dom.options[i] = new Option(i ? i : "(无限制)", i);
		}

		//注册检测函数
		checkTicketCellsQueue.push(function (i, e, prevValue) {
			var limit = parseInt(dom.value);
			if (!prevValue || !(limit > 0)) return null;

			var text = $.trim(e.text());
			if (text == "有") return 2;

			return parseInt(text) >= limit ? 2 : 1;
		});
	})();

	//#endregion

	//#region 保存查询车次类型配置

	(function () {
		var ccTypeCheck = $("input:checkbox[name=trainClassArr]");
		var preccType = (utility.getPref("cctype") || "").split("|");

		if (preccType[0]) {
			ccTypeCheck.each(function () {
				this.checked = $.inArray(this.value, preccType) != -1;
			});
		}
		ccTypeCheck.click(function () {
			utility.setPref("cctype", $.map(ccTypeCheck.filter(":checked"), function (v, i) {
				return v.value;
			}).join("|"));
		});
	})();

	//#endregion

	//#region 增加互换目标的功能

	(function () {
		var fromCode = $("#fromStation");
		var from = $("#fromStationText");
		var toCode = $("#toStation");
		var to = $("#toStationText");

		from.css("width", "50px").after("<input type='button' value='<->' class='lineButton' title='交换出发地和目的地' id='btnExchangeStation' />");
		$("#btnExchangeStation").click(function () {
			var f1 = fromCode.val();
			var f2 = from.val();
			fromCode.val(toCode.val());
			from.val(to.val());
			toCode.val(f1);
			to.val(f2);
		});
	})();

	//#endregion

	//#region 要求发到站和终点站完全匹配

	(function () {
		var fromText = $("#fromStationText");
		var toText = $("#toStationText");

		$("#filterFunctionRow").append("<label style='font-weight:bold;color:red;margin-left:10px;'><input type='checkbox' id='closeFuseSearch'>过滤发站不完全匹配的车次</label><label style='font-weight:bold;color:red;margin-left:10px;'><input type='checkbox' id='closeFuseSearch1'>过滤到站不完全匹配的车次</label>");
		$("#closeFuseSearch, #closeFuseSearch1").parent().attr("title", '默认情况下，例如查找‘杭州’时，会包括‘杭州南’这个车站。勾选此选项，将会在搜索‘杭州’的时候，过滤那些不完全一致的车站，如‘杭州南’。');

		function getStationName() {
			var txt = $.trim(this.text()).split(/\s/);
			return txt[0];
		}

		checkTicketsQueue.push(function (result) {
			if (document.getElementById("closeFuseSearch").checked) {
				var fs = getStationName.call(this.find("td:eq(1)"));
				if (fs != fromText.val()) {
					this.hide();
					return 0;
				}
			}
			if (document.getElementById("closeFuseSearch1").checked) {
				var fs = getStationName.call(this.find("td:eq(2)"));
				if (fs != toText.val()) {
					this.hide();
					return 0;
				}
			}

			return result;
		});
	})();

	//#endregion

	utility.reloadPrefs($("tr.append_row"), "ticket_query");
}

//#endregion

//#region 自动提交订单

function initDirectSubmitOrder() {
	//if (utility.regInfo.type != 'DONT' && Math.random() > 0.3) return;
	return;

	console.log("[INFO] initialize direct submit order.");
	var html = "<div id='fishSubmitFormStatus' class='outerBox' style='position:fixed;left:0px;bottom:-100px;'><div class='box'><div class='title'>自动提交订单中</div>\
<div class='content' style='width:150px;'><ul id='tipScript'>\
<li class='fish_clock' id='countEle' style='font-weight:bold;'>等待操作</li>\
<li style='color:green;'><strong>操作信息</strong>：<span>休息中</span></li>\
<li style='color:green;'><strong>最后操作时间</strong>：<span>--</span></li></div>\
		</div></div>";

	parent.window.$("#fishSubmitFormStatus").remove();
	parent.window.$("body").append(html);

	var tip = parent.window.$("#tipScript li");
	var counter = parent.window.$("#countEle");
	var status = parent.window.$("#fishSubmitFormStatus");
	var formData = null;
	var tourFlag;
	$("#autoorder")[0].disabled = false;

	function setCurOperationInfo(running, msg) {
		counter.removeClass().addClass(running ? "fish_running" : "fish_clock").html(msg || (running ? "正在操作中……" : "等待中……"));
	}

	function setTipMessage(msg) {
		tip.eq(2).find("span").html(utility.getTimeInfo());
		tip.eq(1).find("span").html(msg);
	}

	//窗口状态
	var statusShown = false;
	function showStatus() {
		if (statusShown) return;
		statusShown = true;
		status.animate({ bottom: "0px" });
	}
	function hideStatus() {
		if (!statusShown) return;
		statusShown = false;
		status.animate({ bottom: "-100px" });
	}

	//验证码事件
	$("#randCodeTxt").keyup(function () {
		if (statusShown && document.getElementById("randCodeTxt").value.length == 4) checkOrderInfo();
	});
	//刷新验证码
	function reloadCode() {
		$("#randCode").attr("src", "https://dynamic.12306.cn/otsweb/passCodeAction.do?rand=randp&" + Math.random());
		var vcdom = document.getElementById("randCodeTxt");
		vcdom.focus();
		vcdom.select();
	}
	$("#randCode").click(reloadCode);

	function getVcCode() {
		return document.getElementById("randCodeTxt").value;
	}

	function isCanAutoSubmitOrder() {
		return getVcCode().length == 4 && $("#preSelectSeat").val() && $("input:checkbox[name=preSelectPassenger]:checked").length > 0;
	}

	function redirectToNotCompleteQuery() {
		window.location.replace("/otsweb/order/myOrderAction.do?method=queryMyOrderNotComplete&leftmenu=Y");
	}

	$("#orderForm").submit(function () {
		if (!document.getElementById("autoorder").checked || !isCanAutoSubmitOrder()) return true;
		showStatus();
		utility.notifyOnTop("开始自动提交预定订单！");
		setCurOperationInfo(true, "正在自动提交订单");

		var form = $(this);
		utility.post(form.attr("action"), form.serialize(), "text", function (html) {
			if (html.indexOf("您还有未处理") != -1) {
				hideStatus();
				utility.notifyOnTop("您还有未处理订单！");
				redirectToNotCompleteQuery();
				return;
			}

			setTipMessage("正在分析内容");
			getOrderFormInfo(html);
		}, function () {
			utility.notifyOnTop("提交预定请求发生错误，稍等重试！");
			utility.delayInvoke(counter, function () { $("#orderForm").submit(); }, 2000);
		});


		return false;
	});

	function getOrderFormInfo(html) {
		if (typeof (html) != 'undefined' && html) {
			var data = utility.analyzeForm(html);
			data.fields["orderRequest.reserve_flag"] = "A";	//网上支付
			tourFlag = data.tourFlag;

			//组装请求
			formData = [];
			$.each(data.fields, function (i) {
				if (i.indexOf("orderRequest") != -1 || i.indexOf("org.") == 0 || i == "leftTicketStr") formData.push(i + "=" + encodeURIComponent(this));
			});
			formData.push("tFlag=" + data.tourFlag);

			//添加乘客
			var pas = $("input:checkbox[name=preSelectPassenger]:checked");
			var seat = $("#preSelectSeat").val();
			var seatType = $("#preselectseatlevel").val();

			for (var i = 0; i < 5; i++) {
				if (i >= pas.length) {
					formData.push("oldPassengers=");
					formData.push("checkbox9=");
					continue;
				}

				var p = pas.eq(i).data("pasinfo");
				var ptype = p.passenger_type;
				var idtype = p.passenger_id_type_code;
				var idno = p.passenger_id_no;
				var name = p.passenger_name;

				formData.push("passengerTickets=" + seat + "," + seatType + "," + ptype + "," + encodeURIComponent(name) + "," + idtype + "," + encodeURIComponent(idno) + "," + p.mobile_no + ",Y");
				formData.push("oldPassengers=" + encodeURIComponent(name) + "," + idtype + "," + encodeURIComponent(idno));
				formData.push("passenger_" + (i + 1) + "_seat=" + seat);
				formData.push("passenger_" + (i + 1) + "_seat_detail=" + seatType);
				formData.push("passenger_" + (i + 1) + "_ticket=" + ptype);
				formData.push("passenger_" + (i + 1) + "_name=" + encodeURIComponent(name));
				formData.push("passenger_" + (i + 1) + "_cardtype=" + idtype);
				formData.push("passenger_" + (i + 1) + "_cardno=" + idno);
				formData.push("passenger_" + (i + 1) + "_mobileno=" + p.mobile_no);
				formData.push("checkbox9=Y");
			}
		}

		checkOrderInfo();
	}

	function checkOrderInfo() {
		setCurOperationInfo(true, "正在检测订单状态....");
		utility.notifyOnTop("开始自动提交订单！");

		utility.post("confirmPassengerAction.do?method=checkOrderInfo&rand=" + getVcCode(), formData.join("&") + "&randCode=" + getVcCode(), "json", function (data) {
			console.log(data);
			if ('Y' != data.errMsg || 'N' == data.checkHuimd || 'N' == data.check608) {
				if (data.errMsg && data.errMsg.indexOf("验证码") != -1) {
					utility.notifyOnTop("验证码不正确。请输入验证码！");
					setTipMessage("请重新输入验证码。");
					reloadCode();
				} else {
					setCurOperationInfo(false, data.msg || data.errMsg);
					document.getElementById("autoorder").checked = false;
					$("#orderForm").submit();
				}
				return;
			}

			submitOrder();
		}, function () {
			setCurOperationInfo(false, "网络出现错误，稍等重试");
			utility.delayInvoke(counter, checkOrderInfo, 2000);
		});
	}

	function submitOrder() {
		setCurOperationInfo(true, "正在提交订单");
		setTipMessage("已检测状态。");

		utility.post("/otsweb/order/confirmPassengerAction.do?method=confirmSingleForQueueOrder",
			formData.join("&") + "&randCode=" + getVcCode(), "json", function (data) {
				var msg = data.errMsg;

				if (msg == "Y") {
					setTipMessage("订单提交成功");
					setCurOperationInfo(false, "订单提交成功，请等待排队完成。");
					utility.notifyOnTop("订单提交成功，请等待排队完成。");

					redirectToNotCompleteQuery();

				} else {
					if (msg.indexOf("包含未付款订单") != -1) {
						hideStatus();
						alert("您有未支付订单! 等啥呢, 赶紧点确定支付去.");
						redirectToNotCompleteQuery();
						return;
					}
					if (errmsg.indexOf("重复提交") != -1) {
						setTipMessage("TOKEN失效，刷新Token中....");
						$("#orderForm").submit();
						return;
					}
					if (errmsg.indexOf("包含排队中") != -1) {
						hideStatus();
						alert("您有排队中订单! 点确定转到排队页面");
						redirectToNotCompleteQuery();
						return;
					}

					setTipMessage(msg);
					setCurOperationInfo(false, "未知错误：" + msg + "，请告知作者。自动回滚为手动提交。");
					utility.notifyOnTop("未知错误：" + msg + "，请告知作者。自动回滚为手动提交。");

					document.getElementById("autoorder").checked = false;
					$("#orderForm").submit();
				}
			}, function () {
				setCurOperationInfo(false, "网络出现错误，稍等重试");
				utility.delayInvoke(counter, submitOrder, 2000);
			});
	}

	//周期性检测状态，已确认可以自动提交
	setInterval(function () {
		if (document.getElementById("autoorder").checked && !isCanAutoSubmitOrder()) {
			utility.notifyOnTop("您选择了自动提交订单，但是信息没有设置完整！请选择联系人、填写验证码并选择席别！");
		}
	}, 30 * 1000);

	//最后显示界面，防止初始化失败却显示了界面
	$("td.autoordertd *").show();
}

//#endregion

//#region -----------------自动登录----------------------

function initLogin() {

	//启用日志
	utility.enableLog();

	//如果已经登录，则自动跳转
	utility.unsafeCallback(function () {
		if (parent && parent.$) {
			var str = parent.$("#username_ a").attr("href");
			if (str && str.indexOf("sysuser/user_info") != -1) {
				window.location.href = "https://dynamic.12306.cn/otsweb/order/querySingleAction.do?method=init";
			}
			return;
		}
	});

	//检测主框架是否是顶级窗口
	var isTop = false;
	try {
		isTop = (top.location + '').indexOf("dynamic.12306.cn") != -1;
	} catch (e) {

	}
	if (!isTop) {
		$("#loginForm table tr:first td:last").append("<a href='https://dynamic.12306.cn/otsweb/' target='_blank' style='font-weight:bold;color:red;'>点击这里全屏订票！</a>");
	}



	//Hack当前UI显示
	$(".enter_right").empty().append("<div class='enter_enw'>" +
		"<div class='enter_rtitle' style='padding: 40px 0px 10px 0px; font-size: 20px;'>脚本提示信息</div>" +
		"<div class='enter_rfont'>" +
		"<ul id='tipScript'>" +
		"<li class='fish_clock' id='countEle' style='font-weight:bold;'>等待操作</li>" +
		"<li style='color:green;'><strong>操作信息</strong>：<span>休息中</span></li>" +
		"<li style='color:green;'><strong>最后操作时间</strong>：<span>--</span></li>" +
		"<li> <a href='javascript:;' class='configLink' tab='tabLogin'>登录设置</a> | <a href='http://t.qq.com/ccfish/' target='_blank' style='color:blue;'>腾讯微博</a> | <a href='http://www.fishlee.net/soft/44/' style='color:blue;' target='_blank'>助手主页</a></li><li><a href='http://www.fishlee.net/Discussion/Index/44' target='_blank'>反馈BUG</a> | <a style='font-weight:bold;color:red;' href='http://www.fishlee.net/honor/index.html' target='_blank'>捐助作者</a></li>" +
		"<li id='updateFound' style='display:none;'><a style='font-weight:bold; color:red;' href='http://www.fishlee.net/soft/44/download.html' target='_blank'>发现新版本！点此更新</a></li>" +
		'<li id="enableNotification"><input type="button" id="enableNotify" onclick="$(this).parent().hide();window.webkitNotifications.requestPermission();" value="请点击以启用通告" style="line-height:25px;padding:5px;" /></li><li style="padding-top:10px;line-height:normal;color:gray;">请<strong style="color: red;">最后输验证码</strong>，输入完成后系统将自动帮你提交。登录过程中，请勿离开当前页。如系统繁忙，会自动重新刷新验证码，请直接输入验证码，输入完成后助手将自动帮你提交。</li>' +
		"</ul>" +
		"</div>" +
		"</div>");

	var html = [];
	html.push("<div class='outerbox' style='margin:15px;'><div class='box'><div class='title'>小提示</div><div style='padding:10px;'>");
	html.push("<table><tr><td style='width:33%;font-weight:bold;background-color:#f5f5f5;'><strong>您还可以通过以下网址访问订票网站：</strong></td><td style='width:33%;font-weight:bold;background-color:#f5f5f5;'>助手运行常见问题</td><td style='font-weight:bold;background-color:#f5f5f5;'>版本信息</td></tr>");
	html.push("<tr><td><ul><li style='list-style:disc inside;'><a href='https://www.12306.cn/otsweb/' target='blank'>https://www.12306.cn/otsweb/</a></li>");
	html.push("<li style='list-style:disc inside;'><a href='https://dynamic.12306.cn/otsweb/' target='blank'>https://dynamic.12306.cn/otsweb/</a></li><li style='list-style:disc inside;'><a href='http://dynamic.12306.cn/otsweb/' target='blank'>http://dynamic.12306.cn/otsweb/</a></li>");
	html.push("</ul></td><td><ol>");
	$.each([
		["http://www.fishlee.net/soft/44/12306faq.html", "订票和助手的常见问题"],
		["http://www.fishlee.net/soft/44/faq.html", "助手运行的常见问题"]
	], function (i, n) {
		html.push("<li style='list-style:disc inside;'><a href='" + n[0] + "' target='blank'>" + (n[1] || n[0]) + "</a></li>");
	});
	html.push("</ol></td><td><ul>");
	var info = [];
	info.push("已许可于：" + utility.regInfo.name);
	if (utility.regInfo.bindAcc) {
		if (!utility.regInfo.bindAcc[0] || utility.regInfo.bindAcc[0] == "*") info.push("许可12306帐户：<em>无限</em>");
		else info.push("许可12306帐户：" + utility.regInfo.bindAcc);
	}
	info.push(utility.regInfo.typeDesc);
	info.push("版本：<strong>" + window.helperVersion + "</strong>");
	$.each(info, function (i, n) { html.push("<li style='list-style:disc inside;'>" + n + "</li>"); });
	html.push("<li style='list-style:disc inside;'>【<a href='javascript:;' class='reSignHelper'>重新注册</a>】</li>");
	html.push("</ul></td></tr></table>");
	html.push("</div></div></div>");

	$("div.enter_help").before(html.join(""));


	//插入登录标记
	var form = $("#loginForm");
	var trs = form.find("tr");
	trs.eq(1).find("td:last").html('<label><input type="checkbox" id="keepInfo" /> 记录密码</label>');
	$("#loginForm td:last").html('<label><input type="checkbox" checked="checked" id="autoLogin" name="autoLogin" /> 自动登录</label>');
	utility.reloadPrefs($("#loginForm td:last"));
	$("#keepInfo").change(function () {
		if (!this.checked) {
			if (localStorage.getItem("__un") != null) {
				localStorage.removeItem("__un");
				localStorage.removeItem("__up");
				alert("保存的密码已经删除！");
			}
		}
	});
	//注册判断
	form.submit(function () {
		utility.setPref("_sessionuser", $("#UserName").val());
	});

	if (!window.webkitNotifications || window.webkitNotifications.checkPermission() == 0) {
		$("#enableNotification").remove();
	}

	var tip = $("#tipScript li");
	var count = 1;
	var errorCount = 0;
	var inRunning = false;

	//以下是函数
	function setCurOperationInfo(running, msg) {
		var ele = $("#countEle");
		ele.removeClass().addClass(running ? "fish_running" : "fish_clock").html(msg || (running ? "正在操作中……" : "等待中……"));
	}

	function setTipMessage(msg) {
		tip.eq(2).find("span").html(utility.getTimeInfo());
		tip.eq(1).find("span").html(msg);
	}

	function getLoginRandCode() {
		setCurOperationInfo(true, "正在获得登录随机码");

		$.ajax({
			url: "/otsweb/loginAction.do?method=loginAysnSuggest",
			method: "POST",
			dataType: "json",
			cache: false,
			success: function (json, code, jqXhr) {
				//{"loginRand":"211","randError":"Y"}
				if (json.randError != 'Y') {
					setTipMessage("错误：" + json.randError);
					utility.delayInvoke("#countEle", getLoginRandCode, utility.getLoginRetryTime());
				} else {
					setTipMessage("登录随机码 -&gt; " + json.loginRand);
					$("#loginRand").val(json.loginRand);
					submitForm();
				}
			},
			error: function (xhr) {
				errorCount++;

				if (xhr.status == 403) {
					setTipMessage("[" + errorCount + "] 警告! 403错误, IP已被封!")
					utility.delayInvoke("#countEle", getLoginRandCode, 10 * 1000);
				} else {
					setTipMessage("[" + errorCount + "] 网络请求错误，重试")
					utility.delayInvoke("#countEle", getLoginRandCode, utility.getLoginRetryTime());
				}
			}
		});
	}

	function submitForm() {
		var data = {};
		$.each($("#loginForm").serializeArray(), function () {
			if (this.name == "refundFlag" && !document.getElementById("refundFlag").checked) return;
			data[this.name] = this.value;
		});
		if (!data["loginUser.user_name"] || !data["user.password"] || !data.randCode || data.randCode.length != 4/* || (utility.regInfo.bindAcc && utility.regInfo.bindAcc != data["loginUser.user_name"])*/)
			return;

		if ($("#keepInfo")[0].checked) {
			utility.setPref("__un", data["loginUser.user_name"]);
			utility.setPref("__up", data["user.password"])
		}
		setCurOperationInfo(true, "正在登录中……");
		$.ajax({
			type: "POST",
			url: "/otsweb/loginAction.do?method=login",
			data: data,
			timeout: 30000,
			dataType: "text",
			success: function (html) {
				msg = utility.getErrorMsg(html);

				if (html.indexOf('请输入正确的验证码') > -1) {
					setTipMessage("验证码不正确");
					setCurOperationInfo(false, "请重新输入验证码。");
					stopLogin();
				} else if (msg.indexOf('密码') > -1) {
					setTipMessage(msg);
					setCurOperationInfo(false, "请重新输入。");
					stopLogin();
				} else if (msg.indexOf('锁定') > -1) {
					setTipMessage(msg);
					setCurOperationInfo(false, "请重新输入。");
					stopLogin();
				} else if (html.indexOf("欢迎您登录") != -1) {
					utility.notifyOnTop('登录成功，开始查询车票吧！');
					window.location.href = "https://dynamic.12306.cn/otsweb/order/querySingleAction.do?method=init";
				} else {
					setTipMessage(msg);
					utility.delayInvoke("#countEle", getLoginRandCode, utility.getLoginRetryTime());
				}
			},
			error: function (msg) {
				errorCount++;
				if (xhr.status == 403) {
					setTipMessage("[" + errorCount + "] 警告! 403错误, IP已被封!")
					utility.delayInvoke("#countEle", getLoginRandCode, 10 * 1000);
				} else {
					setTipMessage("[" + errorCount + "] 网络请求错误，重试")
					utility.delayInvoke("#countEle", getLoginRandCode, utility.getLoginRetryTime());
				}
			}
		});
	}


	function relogin() {
		if (inRunning) return;

		var user = $("#UserName").val();
		if (!user) return;
		if (utility.regInfo.bindAcc && utility.regInfo.bindAcc.length && utility.regInfo.bindAcc[0] && $.inArray(user, utility.regInfo.bindAcc) == -1 && utility.regInfo.bindAcc[0] != "*") {
			alert("很抱歉，12306订票助手的授权许可已绑定至【" + utility.regInfo.bindAcc.join() + "】，未授权用户，助手停止运行，请手动操作。\n您可以在登录页面下方的帮助区点击【重新注册】来修改绑定。");
			return;
		}

		count++;
		utility.setPref("_sessionuser", $("#UserName").val());
		inRunning = true;
		getLoginRandCode();
	}

	function stopLogin() {
		//等待重试时，刷新验证码
		$("#img_rrand_code").click();
		$("#randCode").val("")[0].select();
		inRunning = false;
	}

	//初始化
	function executeLogin() {
		count = 1;
		utility.notify("自动登录中：(1) 次登录中...");
		setTipMessage("开始登录中....");
		getLoginRandCode();

		return false;
	}

	var kun = utility.getPref("__un");
	var kup = utility.getPref("__up");
	if (kun && kup) {
		$("#UserName").val(kun);
		$("#password").val(kup);
		$("#randCode")[0].focus();
	}
	$("#randCode").keyup(function (e) {
		if (!$("#autoLogin")[0].checked) return;

		e = e || event;
		if (e.charCode == 13 || $("#randCode").val().length == 4) relogin();
	});
}

//#endregion

//#region 自动重新支付

function initPayOrder() {
	//如果出错，自动刷新
	if ($("div.error_text").length > 0) {
		utility.notifyOnTop("页面出错，稍后自动刷新！");
		setTimeout(function () { self.location.reload(); }, 3000);
	}

	return;
	// undone

	window.payOrder = this;

	//epayOrder
	var oldCall = window.epayOrder;
	var formUrl, formData;

	$("#myOrderForm").submit(function () {
		var form = $(this);
		var action = form.attr("action");
		if (acton && action.index("laterEpay") != -1) {
			return false;
		}
	});
	window.epayOrder = function () {
		oldCall.apply(arguments);

		var form = $("#myOrderForm");
		var formData = utility.serializeForm(form);
		var formUrl = form.attr("action");
	};

	function getsubmitForm() {
		utility.post(formUrl, formData, "text", function (html) {
		}, function () {

		});
	}
}

//#endregion

//#region 检查更新

function checkUpdate() {
	//谷歌的依然有跨站问题。所以用传统的方法，委屈Firefox下Scriptish的新特性了。。
	var updateScriptVersion = document.createElement("script");
	updateScriptVersion.type = "text/javascript";
	updateScriptVersion.textContent = "var version='" + version + "'; " + compareVersion + "; (" + updateScriptContentForChrome + ")();";
	document.head.appendChild(updateScriptVersion);
}

function updateScriptContentForChrome() {
	var updateScipt = document.createElement('script');
	updateScipt.src = 'https://github.com/iccfish/12306_ticket_helper/raw/master/version.js';
	updateScipt.type = 'text/javascript';
	updateScipt.addEventListener('load', function () {
		if (compareVersion(version, version_12306_helper) < 0) {
			if (utility.getPref("diableUpdateVersion") == version_12306_helper) return;

			$("#updateFound").show();
			var info = '订票助手已经发布了最新版 ' + version_12306_helper + '，请在登录页面上点击更新链接更新，更新后请刷新当前页面！\n\n更新内容如下：\n\n';
			if (typeof (version_updater) != 'undefined' && version_updater) {
				info += "* " + version_updater.join(";\n* ");
			} else {
				info += "(暂时没有相关更新内容)";
			}
			info += "\n\n如果此次不更新，点击『是』下次依然提醒；点击『否』永久屏蔽此版本更新提示！";
			if (!confirm(info)) {
				utility.setPref("diableUpdateVersion", version_12306_helper);
			}
		}
	});
	document.head.appendChild(updateScipt);
}

function compareVersion(v1, v2) {
	var vv1 = v1.split('.');
	var vv2 = v2.split('.');

	var length = Math.min(vv1.length, vv2.length);
	for (var i = 0; i < length; i++) {
		var s1 = parseInt(vv1[i]);
		var s2 = parseInt(vv2[i]);

		if (s1 < s2) return -1;
		if (s1 > s2) return 1;
	}

	return vv1.length > vv2.length ? 1 : vv1.length < vv2.length ? -1 : 0;
}

//#endregion
