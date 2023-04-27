var RocknCoder = RocknCoder || {};
RocknCoder.Pages = RocknCoder.Pages || {};

(function () {
	"use strict";

	RocknCoder.Pages.paintPage = (function () {
		var ctx, lineStyle,
			$window = $(window),
			$canvas = $('#flexBox'),
			canvas = $canvas.get(0),
			// resize the canvas after retrieving the current dimensions
			reSizeCanvas = function () {
				var dims = RocknCoder.Dimensions.get();
				$canvas.attr({
					width: dims.width - 40,
					height: dims.height - 360
				});
				return dims;
			},
			// get the context and create a yellow pen
			setContext = function () {
				ctx = canvas.getContext('2d');                
				lineStyle = {
					strokeStyle: "black",
                    shadowColor: "black", 
                    fillStyle: "red",
					lineWidth: 1,
					lineCap: "round"
				};
				$.extend(ctx, lineStyle);
			},
			// do all of the canvas and context stuff
			updateContext = function () {
				window.scrollTo(1, 0);
				//reSizeCanvas();
				setContext();
			},
			// extract the x&y
			extractXY = function (oe) {
				return {
					 x: oe.pageX -27,
					y: oe.pageY -160
				};
			},
			pageshow = function () {
				// watch for orientation change or resize events
				$window.bind('orientationchange resize', function (event) {
					updateContext();
					event.preventDefault();
					return false;
				});
				// start tracking the touches, move the pen to the beginning of a line
				$canvas.bind('touchstart', function (event) {
					var xy = extractXY(event.originalEvent.touches[0]);
					ctx.moveTo(xy.x, xy.y);
					event.preventDefault();
					return false;
				});
				// draw a line from the last point to this one
				$canvas.bind('touchmove', function (event) {
					var xy = extractXY(event.originalEvent.touches[0]);
					ctx.lineTo(xy.x, xy.y);
					ctx.stroke();
					event.preventDefault();
					return false;
				});
				updateContext();
                reSizeCanvas();
			},
			// be a good citizen, unhook any events we hook
			pagehide = function () {
				$window.unbind('orientationchange resize');
				$canvas.unbind('touchstart');
				$canvas.unbind('touchmove');
			};
		return {
			pageshow: pageshow,
			pagehide: pagehide
		};
	}());
}());