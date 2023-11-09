// TradingViewWidget.jsx

import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise: any;

export const TradingViewWidget: React.FC<{ symbol: string }> = ({ symbol }) => {
    const onLoadScriptRef = useRef<any>();
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    useEffect(
        () => {
            onLoadScriptRef.current = createWidget;

            if (!tvScriptLoadingPromise) {
                tvScriptLoadingPromise = new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.id = 'tradingview-widget-loading-script';
                    script.src = 'https://s3.tradingview.com/tv.js';
                    script.type = 'text/javascript';
                    script.onload = resolve;

                    document.head.appendChild(script);
                });
            }

            tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

            return () => { onLoadScriptRef.current = null; }

            function createWidget() {
                if (document.getElementById('tradingview_9e191') && 'TradingView' in window) {
                    new (window as any).TradingView.widget({
                        autosize: true,
                        symbol,
                        interval: "D",
                        timezone: "Etc/UTC",
                        theme: darkmode ? "dark" : "light",
                        style: "1",
                        locale: "en",
                        enable_publishing: false,
                        allow_symbol_change: false,
                        container_id: "tradingview_9e191"
                    });
                }
            }
        },
        []
    );

    return (
        <div className='tradingview-widget-container' style={{ height: "100%", width: "100%", overflow: 'hidden' }}>
            <div id='tradingview_9e191' style={{ height: "calc(100% - 32px)", width: "100%" }} />
            <div className="tradingview-widget-copyright">
                <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a>
            </div>
        </div>
    );
}
