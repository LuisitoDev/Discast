/*                        Documentacion

https://dev.to/abdulbasit313/how-to-develop-a-stopwatch-in-react-js-with-custom-hook-561b documentacion para el contador
https://www.codingdeft.com/posts/react-calling-child-function-from-parent-component/ documentacion para el forwardref

Este es el componente del timer que se usa en el componente de grabadora de audio.

*/

import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { formatTime } from '../../Utils/format-timer';


const Timer = forwardRef((props, ref) => {   

    //Tenemos aquí varios use state que nos ayudarán a setear y manipular el timer ademas de sus estados como los son el estado activo y el estado en pausa.
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false)
    const increment = useRef(null);

    //Esto se usó para que el padre que es la grabadora de audio pudiera disparar estas funciones a traves de su referencia, en estas funciones sucede la magía del timer.
    useImperativeHandle(
        ref,
        () => {
            return {
                startTimer: () => {
                    setIsActive(true)
                    setIsPaused(true)
                    increment.current = setInterval(() => {
                        setTimer((timer) => timer + 1)
                    }, 1000)
                },
                stopTimer: () => {
                    clearInterval(increment.current)
                    setIsPaused(false)
                },
                resetTimer: () => {
                    clearInterval(increment.current)
                    setIsActive(false)
                    setIsPaused(false)
                    setTimer(0)
                }
            };
        }
    );

    return (
        <p>{formatTime(timer)}</p>
    );

})

export default Timer;