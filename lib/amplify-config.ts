import { Amplify } from 'aws-amplify';

export function configureAmplify() {
  // Amplify Gen 2では、amplify_outputs.jsonが自動生成されます
  // デプロイ後に自動的に設定されます
  if (typeof window !== 'undefined') {
    try {
      const outputs = require('../amplify_outputs.json');
      Amplify.configure(outputs);
    } catch (error) {
      console.log('Amplify outputs not found, will be generated on deployment');
    }
  }
}
