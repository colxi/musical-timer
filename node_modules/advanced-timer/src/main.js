/**
 * 
 * Package : Advanced-timer
 * Author : colxi.info
 * Url : https://github.com/colxi/advanced-timer
 * 
 */

(function(){
    'use strict';
    
    let RESUME_CORRECTION_RATE = 2;
    let SYNC_TOLERANCE = 20;

    const Timer =  function(t){
        if( !(this instanceof Timer) ) throw new Error('Timer Consttuctor must be called using "new"');
        if( parseInt(t)!==t || t<1 ) throw new Error('Timer() expects a positive integer (>1)');

        const _timer_status_ = {
            '-1'  : 'destroyed',
            '0'   : 'stopped',
            '1'   : 'running',
            '2'   : 'paused',
            '3'   : 'completed'
        };
        let _timer_statusCode_;
        let _timer_clockRef_;
        let _timer_freq_;
        let _timer_inSync_;

        let _fn_callback_;
        let _fn_condition_;
        let _fn_onComplete_;

        let _time_ellapsed_;        // will store the total time ellapsed
        let _time_pause_;           // stores the time when timer is paused
        let _time_delta_;           // stores the time betwen last tk cycles
        let _time_lastCycle_;       // stores the time of the last cycle

        let _isCorrectionCycle_;

        let _cycle_current_;
        let _cycle_limit_;



        /**
         * [nextCycle description]
         * @return {[type]} [description]
         */
        const nextCycle = function(){
            // calculate deltaTime
            _time_delta_        = new Date() - _time_lastCycle_;
            _time_lastCycle_    = new Date();
            _time_ellapsed_   += _time_delta_;
            // increase cycle counter
            _cycle_current_++;

            // if its a correction cicle (caused by a change if timer delay,
            // destroy the temporary timeout and generate a defnitive
            // interval
            if( _isCorrectionCycle_ ){
                clearTimeout( _timer_clockRef_ );
                clearInterval( _timer_clockRef_ );
                _timer_clockRef_    = setInterval(  nextCycle , _timer_freq_  );
                _isCorrectionCycle_ = false;
                _timer_inSync_      = true;
            }else{
                // set the inSync flag to the appropiate value
                _timer_inSync_ =  _time_delta_ > _timer_freq_+ SYNC_TOLERANCE ? false : true;
            }

            // if a cycle condtion has been set, execute it, and if evaluates to
            // true execute the cycle
            if( !_fn_condition_ || _fn_condition_.apply( timer, [ timer ] ) ){
                _fn_callback_.apply( timer, [ timer ] );
            }
            // if cycle limit ks reached, stop timer
            if( _cycle_current_ >= _cycle_limit_ ) onComplete();

            // done!
            return true;
        };

        /**
         * [complete description]
         * @return {[type]} [description]
         */
        const onComplete = function(){
            // destroy tmer
            clearTimeout( _timer_clockRef_ );
            clearInterval( _timer_clockRef_ );
            // set completed statuscode
            _timer_statusCode_ = Timer.Status.COMPLETED;
            // execte onCompkete callback if setted
            if( _fn_onComplete_ ) _fn_onComplete_.apply( timer, [ timer ] );
        };

        // initialize timer
        _timer_inSync_      = true;
        _timer_freq_        = t;
        _cycle_current_     = 0;
        _cycle_limit_       = Infinity;
        _timer_statusCode_  = Timer.Status.STOPPED;
        _time_delta_        = 0;
        _time_ellapsed_     = 0;


        // timer public API
        const timer = {
            get statusCode(){ return _timer_statusCode_ },
            get status(){ return _timer_status_[_timer_statusCode_] },
            get inSync(){ return _timer_inSync_  },
            get timerDelay(){ return _timer_freq_ },
            get timestamp(){
                let abstime;
                if( _timer_statusCode_=== Timer.Status.DESTROYED ) abstime= 0;
                else if( _timer_statusCode_=== Timer.Status.STOPPED ) abstime = 0;
                else if( _timer_statusCode_=== Timer.Status.RUNNING ) abstime = _time_ellapsed_ + ( new Date() - _time_lastCycle_ );
                else if( _timer_statusCode_=== Timer.Status.PAUSED ) abstime = _time_ellapsed_ + ( _time_pause_ - _time_lastCycle_ );
                else if( _timer_statusCode_=== Timer.Status.COMPLETED ) abstime = _time_ellapsed_;
                return abstime || 0;
            },
            get currentCycle(){ return _cycle_current_ }, // cycle count
            get cycleLimit(){ return _cycle_limit_ },
            get cycleTimestamp(){ return _time_ellapsed_ || 0 }, // time where cycle has started
            get cycleDeltatime(){ return _time_delta_ || 0 }, // delta time betwen previous and current cycle
            get syncThreshold(){ return SYNC_TOLERANCE },

            /**
             * [action description]
             * @param  {[type]} f [description]
             * @return {[type]}   [description]
             */
            action : function(f){
                if( typeof f !== 'function' ) throw new Error('Timer.action() expects a function');
                _fn_callback_ = f;
                return this;
            },

            /**
             * [start description]
             * @return {[type]} [description]
             */
            start: function(reset=true){
                // if its not initialized throw an error
                if( !_fn_callback_ ) throw new Error('Timer.start() Action must be set');
                if( !_timer_freq_ ) throw new Error('Timer.start() Delay must be set');

                if( _timer_statusCode_ === Timer.Status.RUNNING ) return this;
                if( _timer_statusCode_ === Timer.Status.PAUSED ) return this.resume();
                if( _timer_statusCode_ !== Timer.Status.STOPPED ){
                    console.warn('Timer.start() Only stopped timers can be started (Timer Status:'+_timer_statusCode_+')');
                    return this;
                }

                if(reset) this.reset();

                _time_lastCycle_     = new Date();
                _timer_statusCode_   = Timer.Status.RUNNING;
                _timer_clockRef_     = setInterval(  nextCycle , _timer_freq_  );
                return this;
            },

            /**
             * [pause description]
             * @return {[type]} [description]
             */
            pause : function(){
                //todo :allow  set time of pause with an argment

                if( _timer_statusCode_ === Timer.Status.PAUSED ) return this;
                if( _timer_statusCode_ === Timer.Status.STOPPED ) return this;
                if( _timer_statusCode_ !== 1 ){
                    console.warn('Timer.pause() Only running timers can be paused (Timer Status:'+_timer_statusCode_+')');
                    return this;
                }

                // stop timers
                clearTimeout( _timer_clockRef_ );
                clearInterval( _timer_clockRef_ );

                // set new status and store current time, it will be used on
                // resume to calculate how much time is left for next cycle
                // to be triggered
                _timer_statusCode_ = Timer.Status.PAUSED;
                _time_pause_       = new Date();
                return this;
            },

            stop: function(){
                // if running pause first, to prevent this.reset to perform the reset
                // and continue playing from begining 
                if( _timer_statusCode_ === Timer.Status.RUNNING ) this.pause();
                this.reset();
                return this;
            },

            /**
             * [resume description]
             * @return {[type]} [description]
             */
            resume: function(){
                if( _timer_statusCode_ !== Timer.Status.PAUSED ){
                    console.warn('Timer.resume() Only paused timers can be resumed (Timer Status:'+_timer_statusCode_+')');
                    return this;
                }


                _timer_statusCode_  = Timer.Status.RUNNING;
                _isCorrectionCycle_ = true;
                const delayEllapsedTime = _time_pause_ - _time_lastCycle_;
                _time_lastCycle_    = new Date( new Date() - (_time_pause_ - _time_lastCycle_) );

                //if(remainingTime<40) console.warn('to low!')
                // todo, loop tilllfil the remaining  time a d call nextCycle withou timeout
                _timer_clockRef_ = setTimeout(  nextCycle , _timer_freq_ - delayEllapsedTime - RESUME_CORRECTION_RATE );

                return this;
            },

            /**
             * [repeat description]
             * @param  {[type]} c [description]
             * @return {[type]}   [description]
             */
            repeat : function(c=true){
                if( (parseInt(c)!==c || c<1) && c!==true && c!==false) throw new Error('Timer.repeat() expects an integer (>=1) or a boolean');

                // if c is true (default value), remove limit
                if( c === true) _cycle_limit_ = Infinity;
                // if it's false, limit to a single cycle
                else if( c === false) _cycle_limit_ = 1;
                // if is a value use as limit
                else _cycle_limit_ = c;


                // if timer is rnning or oaused, and new limit is higher than
                // the current cycle, finish timer exedution
                if( _timer_statusCode_ === Timer.Status.RUNNING || _timer_statusCode_ === Timer.Status.PAUSED ){
                    if( _cycle_current_ >= _cycle_limit_ ) onComplete();
                }
                return this;
            },

            /**
             * [if description]
             * @param  {[type]} c [description]
             * @return {[type]}   [description]
             */
            if: function(c){
                if( !c ) _fn_condition_ = undefined;
                else if( typeof c === 'function' ) _fn_condition_ = c;
                else throw new Error('Timer.if() expects a function or false');

                return this;
            },

            /**
             * [done description]
             * @param  {Function} done [description]
             * @return {Function}      [description]
             */
            done: function(d){
                if( !d ) _fn_onComplete_ = undefined;
                else if( typeof d === 'function' ) _fn_onComplete_ = d;
                else throw new Error('Timer.done() expects a function or false');

                return this;
            },

            /**
             * [setDelay description]
             * @param {[type]} d [description]
             */
            delay: function(d){
                if( parseInt(d)!==d || d<1) throw new Error('Timer.delay() expects an integer (>1)');

                _timer_freq_ = d;

                if(_timer_statusCode_===Timer.Status.RUNNING){
                    clearTimeout( _timer_clockRef_ );
                    clearInterval( _timer_clockRef_ );

                    _isCorrectionCycle_ = true;
                    let ellapsed = new Date() - _time_lastCycle_;

                    if( ellapsed < _timer_freq_ ){
                        _timer_clockRef_ = setTimeout(  nextCycle , _timer_freq_ - ellapsed );
                    }else{
                        _timer_clockRef_ = setTimeout(  nextCycle , 0 );
                    }
                }

                // force the new Delay value to be applied

                return this;
            },

            /**
             * [destroy description]
             * @return {[type]} [description]
             */
            destroy : function(){
                clearTimeout( _timer_clockRef_ );
                clearInterval( _timer_clockRef_ );
                _fn_callback_ = _fn_condition_ = _fn_onComplete_ = null;
                Object.keys(timer).forEach( k=>  delete timer[k]);
                timer.statusCode = Timer.Status.DESTROYED;
                timer.status = _timer_status_[Timer.Status.DESTROYED];
                return this;
            },


            /**
             * [reset description]
             * @return {[type]} [description]
             */
            reset: function(){
                if( _timer_statusCode_ === Timer.Status.DESTROYED ) throw new Error('Destroyed Timers cannot be reset');

                // stop timers
                clearTimeout( _timer_clockRef_ );
                clearInterval( _timer_clockRef_ );

                let lastStatus = _timer_statusCode_;

                _timer_statusCode_  = Timer.Status.STOPPED; 
                _time_delta_        = 0;
                _cycle_current_     = 0;
                _time_ellapsed_     = 0;
                _time_lastCycle_    = undefined;
                _time_pause_        = undefined;
                _isCorrectionCycle_ = false;
                _timer_inSync_      = true;


                if( lastStatus === Timer.Status.RUNNING ) return this.start(false);

                return this;
            },

            /**
             * [setSyncThreshold description]
             * @param {[type]} x [description]
             */
            setSyncThreshold : function(x){
                if( parseInt(x)!==x || x<0) throw new Error('Timer.setSyncThreshold() expects a positive integer');
                SYNC_TOLERANCE=x;
                return true;
            }

        };


        return timer;
    };

    Timer.Status = {
        'DESTROYED' : -1,
        'STOPPED'   : 0,
        'RUNNING'   : 1,
        'PAUSED'    : 2,
        'COMPLETED' : 3
    };



    if( typeof module !== 'undefined' && module.exports ) module.exports = Timer;
    else{
        // if running in Browser, set a global variable.
        let _global = typeof window === 'object' && window.self === window && window ||
                    typeof self === 'object' && self.self === self && self ||
                    typeof global === 'object' && global.global === global && global;

        _global.Timer = Timer;
    }



})();



