/*! jquery-jsteps jquery 步骤条 License LGPL  http://github.com/shixinke/jquery-steps By 诗心客 version:1.0 */
(function($){
    function Jsteps(settings, container) {
        this.settings = settings;
        this.$element = {};
        this.$element.head = container.find(settings.head);
        this.$element.headItem = this.$element.head.find(settings.headItem);
        this.$element.content = container.find(settings.content);
        this.$element.panelItem = this.$element.content.find(settings.panelItem);
        this.$element.prevBtn = container.find(settings.buttons.prev);
        this.$element.nextBtn = container.find(settings.buttons.next);
        this.$element.finishBtn = container.find(settings.buttons.finish);
        this.step = 0;
        this.steps = this.$element.headItem.length;
        this.validated = !settings.validate ? true : false;
    }
    Jsteps.prototype.init = function(){
        var settings = this.settings;
        var step = 0;
        this.$element.headItem.each(function(index){
            if ($(this).hasClass(settings.statusClassNames.process)) {
                step = index
            }
        });
        this.step = step;
        if (this.step != this.steps -1) {
            this.$element.finishBtn.hide();
        }
    };
    Jsteps.prototype.setStep = function(step){
        this.step = step;
        var self = this;
        if (this.step > this.steps - 1) {
            return;
        }
        self.$element.headItem.each(function(index){
            if (index < step) {
                $(this).removeClass(self.settings.statusClassNames.process+' '+self.settings.statusClassNames.wait).addClass(self.settings.statusClassNames.finish)
            } else if (index == step) {
                $(this).removeClass(self.settings.statusClassNames.wait + ' ' + self.settings.statusClassNames.finish).addClass(self.settings.statusClassNames.process);
            } else {
                $(this).removeClass(self.settings.statusClassNames.process + ' ' + self.settings.statusClassNames.finish).addClass(self.settings.statusClassNames.wait);
            }
        });
        self.$element.panelItem.each(function(index){
            if (index == step) {
                $(this).removeClass(self.settings.inactiveClassName).addClass(self.settings.activeClassName);
            } else {
                $(this).removeClass(self.settings.activeClassName).addClass(self.settings.inactiveClassName);
            }
        });
    };
    Jsteps.prototype.getStep = function(){
        return this.step;
    };
    Jsteps.prototype.prevStep = function(){
        if (this.step > 0) {
            this.setStep(this.step - 1)
        } else {
            this.setStep(0);
        }
        if (this.step < this.steps - 1) {
            this.$element.nextBtn.show();
            this.$element.finishBtn.hide();
        }
    };
    Jsteps.prototype.nextStep = function(){
        if (this.step >= this.steps - 1) {
            this.setStep(this.steps - 1)
        } else {
            this.setStep(this.step + 1);
        }
        if (this.step == this.steps - 1) {
            this.$element.nextBtn.hide();
            this.$element.finishBtn.show();
        }
    };
    Jsteps.prototype.setValid = function(val){
        this.validated = val;
    };
    Jsteps.prototype.valid = function(){
        return this.validated;
    };
    function toCamelCase(str){
        var strArr=str.split('-');
        for(var i=1;i<strArr.length;i++){
            strArr[i]=strArr[i].charAt(0).toUpperCase()+strArr[i].substring(1);
        }
        return strArr.join('');
    }
    $.fn.jSteps = function(options) {
        var settings = $.extend({}, $.fn.jSteps.defaults, options);
        var _this;
        return this.each(function(){
            _this = $(this);
            var data = $(this).data();
            var dataObj = {};
            for (var ele in data) {
                dataObj[toCamelCase(ele)] = data[ele];
            }

            settings = $.extend(settings, dataObj);
            var obj = new Jsteps(settings, _this);
            obj.init();
            obj.$element.nextBtn.on('click', function(){
                if (typeof settings.onNext == 'function') {
                    settings.onNext(obj);
                }
                if (obj.validated) {
                    if (typeof settings.onValidate == 'function') {
                        settings.onValidate(obj);
                    }
                    obj.nextStep();
                }
            });
            obj.$element.prevBtn.on('click', function(){
                if (typeof settings.onPrev == 'function') {
                    settings.onPrev(obj);
                }
                if (obj.validated) {
                    obj.prevStep();
                }
            });
            obj.$element.finishBtn.on('click', function(e){
                if (obj.validated) {
                    if (typeof settings.onFinish == 'function') {
                        e.preventDefault();
                        settings.onFinish(obj);
                    }
                }
            });
            return obj;
        });
    };

    $.fn.jSteps.defaults = {
        head:'.jsteps-steps',
        headItem:'.jsteps-item',
        statusClassNames:{
            process:'jsteps-status-process',
            wait:'jsteps-status-wait',
            finish:'jsteps-status-finish'
        },
        content:'.jsteps-content',
        panelItem:'.jsteps-pane',
        activeClassName:'active',
        inactiveClassName:'inactive',
        buttons:{
            prev:'.btn-prev',
            next:'.btn-next',
            finish:'.btn-finish'
        },
        validate:false,
        onValidate:null,
        onNext:null,
        onFinish:null,
        onPrev:null
    }
})(jQuery);