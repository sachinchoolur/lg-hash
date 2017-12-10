(function() {
    
        'use strict';
    
        var defaults = {
            hash: true
        };
    
        var Hash = function(element) {
    
            this.core = $(element).data('lightGallery');
    
            this.core.s = $.extend({}, defaults, this.core.s);
    
            if (this.core.s.hash) {
                this.oldHash = window.location.hash;
                this.init();
            }
    
            return this;
        };
    
        Hash.prototype.init = function() {
            var _this = this;
            var _hash;
    
            // Change hash value on after each slide transition
            _this.core.$el.on('onAfterSlide.lg.tm', function(event, prevIndex, index) {

                var slideName = _this.core.s.dynamic ? _this.core.s.dynamicEl[index].slideName : _this.core.$items.eq(index).data('slideName');
                slideName = _this.core.s.customSlideName ? slideName : index;
                if (history.replaceState) {
                    history.replaceState(null, null, window.location.pathname + '#lg=' + _this.core.s.galleryId + '&slide=' + slideName);
                } else {
                    window.location.hash = 'lg=' + _this.core.s.galleryId + '&slide=' + slideName;
                }
            });
    
            // Listen hash change and change the slide according to slide value
            $(window).on('hashchange.lg.hash', function() {
                _hash = window.location.hash;
                var index = _this.core.getIndexFromUrl(_hash);

                // it galleryId doesn't exist in the url close the gallery
                if ((_hash.indexOf('lg=' + _this.core.s.galleryId) > -1)) {
                    _this.core.slide(index, false, false);
                } else if (_this.core.lGalleryOn) {
                    _this.core.destroy();
                }
    
            });
        };
    
        Hash.prototype.destroy = function() {
    
            if (!this.core.s.hash) {
                return;
            }
    
            // Reset to old hash value
            if (this.oldHash && this.oldHash.indexOf('lg=' + this.core.s.galleryId) < 0) {
                if (history.replaceState) {
                    history.replaceState(null, null, this.oldHash);
                } else {
                    window.location.hash = this.oldHash;
                }
            } else {
                if (history.replaceState) {
                    history.replaceState(null, document.title, window.location.pathname + window.location.search);
                } else {
                    window.location.hash = '';
                }
            }
    
            this.core.$el.off('.lg.hash');
    
        };
    
        $.fn.lightGallery.modules.hash = Hash;
    
    })();
