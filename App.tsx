import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Gender = 'female' | 'male';

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#57b8d6' };
  if (bmi < 25) return { label: 'Healthy range', color: '#63c69b' };
  if (bmi < 30) return { label: 'Overweight', color: '#f0b65c' };
  return { label: 'Obesity range', color: '#ee7777' };
}

export default function App() {
  const [gender, setGender] = useState<Gender | null>(null);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [age, setAge] = useState(25);
  const [bmi, setBmi] = useState<number | null>(null);
  const category = bmi === null ? null : getBmiCategory(bmi);

  function calculateBmi() {
    const heightInMeters = height / 100;
    setBmi(weight / (heightInMeters * heightInMeters));
  }

  function adjustValue(
    setter: (value: number | ((current: number) => number)) => void,
    delta: number,
    minimum: number,
    maximum: number,
  ) {
    setter((current) => Math.min(maximum, Math.max(minimum, current + delta)));
    setBmi(null);
  }

  function selectGender(value: Gender) {
    setGender(value);
    setBmi(null);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>BMI CALCULATOR</Text>

      <View style={styles.genderRow}>
        {(['female', 'male'] as const).map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: gender === option }}
            onPress={() => selectGender(option)}
            style={({ pressed }) => [
              styles.genderCard,
              gender === option && styles.selectedCard,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.genderIcon}>{option === 'female' ? '♀' : '♂'}</Text>
            <Text style={styles.cardLabel}>{option.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.heightCard}>
        <Text style={styles.cardLabel}>HEIGHT</Text>
        <View style={styles.heightValueRow}>
          <Text style={styles.heightValue}>{height}</Text>
          <Text style={styles.unit}>cm</Text>
        </View>
        <View style={styles.heightControls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Decrease height"
            onPress={() => adjustValue(setHeight, -1, 100, 220)}
            style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
          >
            <Text style={styles.smallButtonText}>−</Text>
          </Pressable>
          <View style={styles.heightTrack}>
            <View style={[styles.heightFill, { width: `${((height - 100) / 120) * 100}%` }]} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Increase height"
            onPress={() => adjustValue(setHeight, 1, 100, 220)}
            style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
          >
            <Text style={styles.smallButtonText}>+</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.measurementRow}>
        <View style={styles.measurementCard}>
          <Text style={styles.cardLabel}>WEIGHT</Text>
          <Text style={styles.measurementValue}>{weight}</Text>
          <Text style={styles.unit}>kg</Text>
          <View style={styles.adjustmentRow}>
            <AdjustButton
              label="Decrease weight"
              onPress={() => adjustValue(setWeight, -1, 20, 250)}
            />
            <AdjustButton
              label="Increase weight"
              onPress={() => adjustValue(setWeight, 1, 20, 250)}
            />
          </View>
        </View>
        <View style={styles.measurementCard}>
          <Text style={styles.cardLabel}>AGE</Text>
          <Text style={styles.measurementValue}>{age}</Text>
          <Text style={styles.unit}>years</Text>
          <View style={styles.adjustmentRow}>
            <AdjustButton
              label="Decrease age"
              onPress={() => adjustValue(setAge, -1, 2, 120)}
            />
            <AdjustButton
              label="Increase age"
              onPress={() => adjustValue(setAge, 1, 2, 120)}
            />
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={calculateBmi}
        style={({ pressed }) => [styles.calculateButton, pressed && styles.pressed]}
      >
        <Text style={styles.calculateText}>CALCULATE BMI</Text>
      </Pressable>

      {bmi !== null && category && (
        <View style={styles.resultCard}>
          <Text style={[styles.resultCategory, { color: category.color }]}>
            {category.label}
          </Text>
          <Text style={styles.resultValue}>{bmi.toFixed(1)}</Text>
          <Text style={styles.resultNote}>BMI is an estimate and not a medical diagnosis.</Text>
        </View>
      )}
    </View>
  );
}

function AdjustButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.smallButton, pressed && styles.pressed]}
    >
      <Text style={styles.smallButtonText}>{label.startsWith('Decrease') ? '−' : '+'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#10141d',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 18,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 14,
  },
  genderCard: {
    flex: 1,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#202735',
    borderColor: '#202735',
    borderWidth: 2,
  },
  selectedCard: {
    borderColor: '#e76f83',
  },
  genderIcon: {
    color: '#f0a0ac',
    fontSize: 42,
    marginBottom: 6,
  },
  cardLabel: {
    color: '#aab3c2',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heightCard: {
    minHeight: 138,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#202735',
    marginTop: 14,
    padding: 18,
  },
  heightValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  heightValue: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: '700',
  },
  unit: {
    color: '#aab3c2',
    fontSize: 14,
    marginLeft: 6,
  },
  heightControls: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  heightTrack: {
    flex: 1,
    height: 5,
    overflow: 'hidden',
    borderRadius: 3,
    backgroundColor: '#3b4554',
  },
  heightFill: {
    height: '100%',
    backgroundColor: '#e76f83',
  },
  measurementRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 14,
  },
  measurementCard: {
    flex: 1,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#202735',
    padding: 14,
  },
  measurementValue: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '700',
    marginTop: 6,
  },
  adjustmentRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  smallButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: '#394353',
  },
  smallButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 26,
  },
  calculateButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#e76f83',
    marginTop: 16,
  },
  calculateText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  resultCard: {
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#202735',
    marginTop: 12,
    padding: 12,
  },
  resultCategory: {
    fontSize: 15,
    fontWeight: '700',
  },
  resultValue: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    marginVertical: 2,
  },
  resultNote: {
    color: '#aab3c2',
    fontSize: 11,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
