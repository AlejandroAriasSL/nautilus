import { InspectionResult } from "platform/ts/TsPreprocessor";
import { Decorator, ObjectLiteralExpression, PropertyAssignment, SyntaxKind } from "ts-morph";


export function createComponent(decorator?: Decorator) : 
InspectionResult 
{
  if (!decorator) return { path: "", stylesUrl: "" };

  const callExpresion = decorator.getCallExpression();
  if (!callExpresion) return { path: "", stylesUrl: "" };

  const arg = callExpresion.getArguments()[0];
  const obj = arg?.asKind(SyntaxKind.ObjectLiteralExpression);
  if (!obj) return { path: "", stylesUrl: "" };

  return obj.getProperties()
    .filter((prop): prop is PropertyAssignment => prop.getKind() === SyntaxKind.PropertyAssignment)
    .reduce((acc, prop) => {
      const name = prop.getName();
      const value = prop.getInitializer()?.getText().replace(/['"]/g, "") || "";
      acc[name] = value;
      return acc;
    }, {} as Record<string,string>);
}