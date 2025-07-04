import BmiService from '../services/BmiService';

describe('BmiService.calculate', () => {
  it('berechnet den BMI korrekt (auf 2 Dezimalstellen)', () => {
    expect(BmiService.calculate(70, 170)["bmi"]).toBe("24.22");
    expect(BmiService.calculate(50, 150)["bmi"]).toBe("22.22");
    expect(BmiService.calculate(80, 160)["bmi"]).toBe("31.25");
  });
});

describe('BmiService.classify', () => {
  it('gibt die richtige WHO-Klassifizierung zurück', () => {
    const cases = [
      { bmi: 15.9, expect: 'Severe thinness' },
      { bmi: 16.5, expect: 'Moderate thinness' },
      { bmi: 18.0, expect: 'Mild thinness' },
      { bmi: 22.0, expect: 'Normal' },
      { bmi: 27.0, expect: 'Pre-obese' },
      { bmi: 32.0, expect: 'Obese Class I' },
      { bmi: 37.0, expect: 'Obese Class II' },
      { bmi: 45.0, expect: 'Obese Class III' },
    ];

    cases.forEach(({bmi, expect: klass}) => {
      expect(BmiService.classify(bmi)).toBe(klass);
    });
  });
});
