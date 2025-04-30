import { CardSolution } from '../card-solution';
import { solutions } from './data';

export function Solutions() {
  return (
    <section className="w-full bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-8 py-24">
        <div className="flex flex-col gap-14">
          {solutions.map((solution, index) => (
            <CardSolution key={index} {...solution} />
          ))}
        </div>
      </div>
    </section>
  );
}
