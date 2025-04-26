import { resolveElements } from '../utils/resolve-elements.mjs';
import { frame, cancelFrame } from '../frameloop/frame.mjs';

function styleEffect(subject, values) {
    const elements = resolveElements(subject);
    const subscriptions = [];
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        for (const key in values) {
            const value = values[key];
            /**
             * TODO: Get specific setters for combined props (like x)
             * or values with default types (like color)
             *
             * TODO: CSS variable support
             */
            const updateStyle = () => {
                element.style[key] = value.get();
            };
            const scheduleUpdate = () => frame.render(updateStyle);
            const cancel = value.on("change", scheduleUpdate);
            scheduleUpdate();
            subscriptions.push(() => {
                cancel();
                cancelFrame(updateStyle);
            });
        }
    }
    return () => {
        for (const cancel of subscriptions) {
            cancel();
        }
    };
}

export { styleEffect };
