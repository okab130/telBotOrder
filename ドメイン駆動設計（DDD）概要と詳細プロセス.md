# ドメイン駆動設計（DDD）の概要と詳細プロセス

## 目次
1. [DDDとは](#dddとは)
2. [DDDの基本概念](#dddの基本概念)
3. [戦略的設計（Strategic Design）](#戦略的設計strategic-design)
4. [戦術的設計（Tactical Design）](#戦術的設計tactical-design)
5. [DDDの実践プロセス](#dddの実践プロセス)
6. [telBotOrderプロジェクトでの適用例](#telbotorderプロジェクトでの適用例)

---

## DDDとは

### 定義

**ドメイン駆動設計（Domain-Driven Design, DDD）** は、複雑なソフトウェア開発において、ビジネスドメイン（業務領域）の複雑さに焦点を当て、ドメインエキスパートと開発者が協力してソフトウェアを設計する手法です。

### 提唱者

**Eric Evans** が2003年に著書「Domain-Driven Design: Tackling Complexity in the Heart of Software」で体系化。

### DDDが解決する問題

```
❌ 従来のアプローチ:
┌────────────────────────────────┐
│ ビジネス部門                    │
│ 「お客様が注文するシステム」      │
└────────────────────────────────┘
         ↓ 要件書
┌────────────────────────────────┐
│ 開発部門                        │
│ 「OrderテーブルとUserテーブル」  │
└────────────────────────────────┘

問題点:
- ビジネスロジックとコードが乖離
- 仕様変更時にビジネス側と開発側で認識のズレ
- 複雑なドメインをデータベーステーブルでしか考えられない

✅ DDDのアプローチ:
┌────────────────────────────────┐
│ ビジネスドメインエキスパート      │
│         ⇅                      │
│ 開発者                          │
│                                │
│ 共通言語（ユビキタス言語）で対話  │
│ Session, Order, MenuItem...    │
└────────────────────────────────┘
         ↓
┌────────────────────────────────┐
│ ドメインモデル                  │
│ ビジネスロジックがコードに反映    │
└────────────────────────────────┘
```

---

## DDDの基本概念

### 1. ドメイン（Domain）

**定義**: ソフトウェアが解決しようとする業務領域・問題領域

```
例: telBotOrderプロジェクト
┌─────────────────────────────────────┐
│ ドメイン: レストランのモバイル注文    │
│                                     │
│ サブドメイン:                        │
│ - 顧客注文（コア）                   │
│ - 調理管理（コア）                   │
│ - 会計処理（コア）                   │
│ - メニュー管理（サポート）            │
│ - ユーザー認証（汎用）               │
│ - 決済処理（汎用）                   │
└─────────────────────────────────────┘

コアドメイン: ビジネスの競争優位性を生む領域
サポートドメイン: 必要だが差別化要因ではない領域
汎用ドメイン: 既存ソリューションで対応可能な領域
```

### 2. ドメインモデル（Domain Model）

**定義**: ドメインの概念、ルール、関係性を表現したモデル

```typescript
// ドメインモデルの例
class Session {
  // エンティティの識別子
  private id: string;
  
  // 値オブジェクト
  private partySize: PartySize;
  private status: SessionStatus;
  
  // ビジネスルールの表現
  canAddOrder(): boolean {
    return this.status.isActive();
  }
  
  requestPayment(): void {
    if (this.orders.isEmpty()) {
      throw new DomainException('注文がないため会計できません');
    }
    this.status = SessionStatus.paymentRequested();
  }
}
```

### 3. ユビキタス言語（Ubiquitous Language）

**定義**: ドメインエキスパートと開発者が共通して使う言葉

```
Session（セッション）= 来店から退店までの活動
Order（注文）= 1回の注文操作
OrderItem（注文明細）= 注文内の個別商品
MenuItem（メニュー項目）= 提供可能な商品

→ コード、会話、ドキュメント全てで同じ言葉を使う
```

---

## 戦略的設計（Strategic Design）

### 1. 境界付けられたコンテキスト（Bounded Context）

**定義**: ドメインモデルが有効な境界

```
telBotOrderプロジェクトのコンテキストマップ:

┌──────────────────────┐
│ 顧客コンテキスト      │
│ - Session           │
│ - Order             │
│ - StaffCall         │
└──────────────────────┘
         ↓
    [共有カーネル]
         ↓
┌──────────────────────┐       ┌──────────────────────┐
│ 調理コンテキスト      │       │ メニュー管理コンテキスト│
│ - KitchenTicket     │←──────│ - MenuItem           │
│ - OrderItem         │ 参照   │ - Category           │
└──────────────────────┘       └──────────────────────┘
         ↓
    [上流/下流]
         ↓
┌──────────────────────┐
│ 会計コンテキスト      │
│ - Payment           │
│ - Receipt           │
└──────────────────────┘
```

### 2. コンテキストマップ（Context Map）

**定義**: コンテキスト間の関係性を図示したもの

#### コンテキスト間の統合パターン

```
1. 共有カーネル（Shared Kernel）
   ┌─────┐
   │Core │ ← 複数のコンテキストで共有
   └─────┘
   利点: 重複排除
   欠点: 変更が全体に影響

2. 顧客/サプライヤー（Customer/Supplier）
   [上流] → [下流]
   上流: 機能を提供する側
   下流: 機能を利用する側

3. 準拠者（Conformist）
   下流が上流のモデルをそのまま受け入れる
   例: 外部API（Stripe, Telegram）を使う場合

4. 腐敗防止層（Anti-Corruption Layer, ACL）
   外部システムの影響からドメインモデルを保護
   
   [外部API] → [ACL] → [自ドメイン]
   
   例:
   Telegram API → TelegramAdapter → Session

5. 公開ホストサービス（Open Host Service）
   標準化されたプロトコルで公開
   例: REST API, GraphQL

6. 別々の道（Separate Ways）
   統合せず、独立して開発
```

### 3. サブドメインの分類

```
コアドメイン（Core Domain）
├─ ビジネスの競争優位性を生む
├─ 最も重要で複雑
└─ 自社開発すべき
   例: 独自の注文フロー、グループ注文機能

サポートドメイン（Supporting Domain）
├─ 必要だが差別化要因ではない
├─ 標準的な実装で十分
└─ 外注や既存ツールの活用も検討
   例: メニュー管理、在庫管理

汎用サブドメイン（Generic Subdomain）
├─ 業界共通の機能
├─ 既存のライブラリ/SaaSで対応
└─ 自社開発の必要なし
   例: 認証、決済、メール送信
```

---

## 戦術的設計（Tactical Design）

### 1. エンティティ（Entity）

**定義**: 一意の識別子を持ち、ライフサイクルを通じて同一性を保つオブジェクト

```typescript
// ✅ エンティティの例
class Order {
  // 識別子（絶対に変わらない）
  private readonly id: OrderId;
  
  // 属性（変更される可能性がある）
  private status: OrderStatus;
  private totalAmount: Money;
  private items: OrderItem[];
  
  // 同一性の判定は識別子で行う
  equals(other: Order): boolean {
    return this.id.equals(other.id);
  }
}

// 同じOrderでも状態が変わる
const order1 = new Order(id: "123", status: PENDING);
const order2 = new Order(id: "123", status: COMPLETED);
order1.equals(order2); // → true（IDが同じなら同一）
```

### 2. 値オブジェクト（Value Object）

**定義**: 識別子を持たず、属性の値で同一性を判断するオブジェクト

```typescript
// ✅ 値オブジェクトの例
class Money {
  private readonly amount: number;
  private readonly currency: string;
  
  constructor(amount: number, currency: string) {
    if (amount < 0) {
      throw new Error('金額は0以上である必要があります');
    }
    this.amount = amount;
    this.currency = currency;
  }
  
  // 値オブジェクトは不変（Immutable）
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('通貨が異なります');
    }
    return new Money(this.amount + other.amount, this.currency);
  }
  
  // 同一性は値で判断
  equals(other: Money): boolean {
    return this.amount === other.amount && 
           this.currency === other.currency;
  }
}

const money1 = new Money(1000, 'JPY');
const money2 = new Money(1000, 'JPY');
money1.equals(money2); // → true（値が同じなら同一）
```

#### 値オブジェクトの特徴

```
✅ 不変性（Immutable）
   - 生成後は変更できない
   - 変更が必要な場合は新しいインスタンスを作成

✅ 自己検証（Self-Validation）
   - コンストラクタでバリデーション
   - 不正な値オブジェクトは作成できない

✅ 概念の明確化
   Money（金額）、Email（メールアドレス）、PhoneNumber（電話番号）
   → 単なるstringやnumberより意味が明確

例:
class Email {
  private readonly value: string;
  
  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error('無効なメールアドレス');
    }
    this.value = value;
  }
  
  private isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}

// ❌ 不正な値オブジェクトは作成できない
const email = new Email('invalid'); // → Error
```

### 3. 集約（Aggregate）

**定義**: 関連するエンティティと値オブジェクトをまとめた単位

```typescript
// 集約ルート（Aggregate Root）
class Order {
  private readonly id: OrderId;
  private items: OrderItem[];  // 集約内のエンティティ
  private status: OrderStatus;
  
  // 集約の不変条件（Invariant）を守る
  addItem(menuItem: MenuItem, quantity: number): void {
    // ビジネスルール: 注文確定後は追加不可
    if (this.status.isConfirmed()) {
      throw new Error('確定済みの注文には追加できません');
    }
    
    // ビジネスルール: 最大10個まで
    if (quantity > 10) {
      throw new Error('1商品の最大注文数は10個です');
    }
    
    this.items.push(new OrderItem(menuItem, quantity));
  }
  
  // 集約の外部からはOrderを通してのみOrderItemにアクセス
  getItems(): ReadonlyArray<OrderItem> {
    return this.items;
  }
}

// ❌ NG: OrderItemに直接アクセス
orderItem.changeQuantity(100);

// ✅ OK: 集約ルート経由でアクセス
order.changeItemQuantity(itemId, 5);
```

#### 集約の設計原則

```
1. 小さく保つ
   ❌ NG: 1つの集約に全てを詰め込む
   ✅ OK: 必要最小限のエンティティのみ含める

2. IDで他の集約を参照
   ❌ NG: 
   class Order {
     customer: Customer;  // 他の集約を直接保持
   }
   
   ✅ OK:
   class Order {
     customerId: CustomerId;  // IDで参照
   }

3. 集約の境界でトランザクション境界
   1つの集約 = 1つのトランザクション
   複数の集約 = 結果整合性（Eventual Consistency）

4. 不変条件を守る
   集約ルートが責任を持つ
```

### 4. ドメインサービス（Domain Service）

**定義**: エンティティや値オブジェクトに属さないビジネスロジック

```typescript
// ドメインサービスの例
class PaymentCalculationService {
  // 複数の集約をまたがる計算
  calculateTotal(session: Session): Money {
    const orders = session.getOrders();
    
    let total = Money.zero('JPY');
    for (const order of orders) {
      if (!order.isCancelled()) {
        total = total.add(order.getTotalAmount());
      }
    }
    
    return total;
  }
}

// 使用例
const service = new PaymentCalculationService();
const totalAmount = service.calculateTotal(session);
```

#### ドメインサービスが必要なケース

```
✅ 複数のエンティティにまたがる処理
   例: Session全体の合計金額計算

✅ どのエンティティにも属さない概念
   例: 「売上分析」「推奨メニュー計算」

❌ 使いすぎに注意
   本来エンティティに属すべきロジックをサービスに書かない
```

### 5. リポジトリ（Repository）

**定義**: 集約の永続化と取得を抽象化

```typescript
// リポジトリインターフェース（ドメイン層）
interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Order | null>;
  findBySessionId(sessionId: SessionId): Promise<Order[]>;
  delete(order: Order): Promise<void>;
}

// 実装（インフラ層）
class PrismaOrderRepository implements OrderRepository {
  async save(order: Order): Promise<void> {
    // Prismaを使ってDBに保存
    await prisma.order.upsert({
      where: { id: order.getId().value },
      update: this.toData(order),
      create: this.toData(order),
    });
  }
  
  async findById(id: OrderId): Promise<Order | null> {
    const data = await prisma.order.findUnique({
      where: { id: id.value },
      include: { orderItems: true },
    });
    
    return data ? this.toDomain(data) : null;
  }
  
  // DBレコード → ドメインモデル変換
  private toDomain(data: any): Order {
    return Order.reconstruct(
      new OrderId(data.id),
      data.orderItems.map(item => /* ... */),
      OrderStatus.fromString(data.status)
    );
  }
}
```

#### リポジトリの役割

```
✅ 永続化の詳細をドメイン層から隠蔽
   ドメイン層: OrderRepositoryインターフェースだけ知る
   インフラ層: Prisma, TypeORMなどの実装詳細

✅ コレクションのように扱える
   repository.save(order);
   repository.findById(id);
   
✅ テスト容易性の向上
   テスト時: インメモリリポジトリを使用
   本番時: Prismaリポジトリを使用
```

### 6. ファクトリ（Factory）

**定義**: 複雑なオブジェクトの生成を担当

```typescript
// ファクトリの例
class SessionFactory {
  create(
    table: Table,
    partySize: number,
    telegramChatId: string
  ): Session {
    // 複雑な生成ロジック
    const sessionId = SessionId.generate();
    const qrCode = this.generateQRCode(table, sessionId);
    
    // ビジネスルールの適用
    if (partySize > table.capacity) {
      throw new Error('来店人数がテーブルの定員を超えています');
    }
    
    return new Session(
      sessionId,
      table.getId(),
      new PartySize(partySize),
      SessionStatus.active(),
      telegramChatId,
      qrCode
    );
  }
  
  private generateQRCode(table: Table, sessionId: SessionId): string {
    // QRコード生成ロジック
    return `https://t.me/bot?start=${table.number}_${sessionId.value}`;
  }
}
```

### 7. ドメインイベント（Domain Event）

**定義**: ドメイン内で発生した重要な出来事

```typescript
// ドメインイベントの例
class OrderPlacedEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly sessionId: SessionId,
    public readonly occurredAt: Date
  ) {}
}

class Order {
  private events: DomainEvent[] = [];
  
  place(): void {
    // 状態変更
    this.status = OrderStatus.pending();
    
    // イベント発行
    this.events.push(
      new OrderPlacedEvent(
        this.id,
        this.sessionId,
        new Date()
      )
    );
  }
  
  getEvents(): DomainEvent[] {
    return this.events;
  }
  
  clearEvents(): void {
    this.events = [];
  }
}

// イベントハンドラ
class OrderPlacedEventHandler {
  async handle(event: OrderPlacedEvent): Promise<void> {
    // 調理キューに追加
    await kitchenService.addToQueue(event.orderId);
    
    // 通知送信
    await notificationService.notifyKitchen(event.orderId);
  }
}
```

---

## DDDの実践プロセス

### Phase 1: ドメインの理解（Knowledge Crunching）

```
1. ドメインエキスパートへのインタビュー
   ┌─────────────────────────────────┐
   │ Q: お客様はどうやって注文しますか？│
   │ A: テーブルのQRコードをスキャン    │
   │    して、スマホから注文します      │
   │                                 │
   │ Q: 追加注文はできますか？          │
   │ A: はい、会計前なら何度でも可能です│
   └─────────────────────────────────┘

2. イベントストーミング（Event Storming）
   時系列でドメインイベントを洗い出す
   
   [来店] → [QRスキャン] → [セッション開始]
     ↓
   [メニュー閲覧] → [商品選択] → [注文確定]
     ↓
   [調理開始] → [調理完了] → [提供]
     ↓
   [会計依頼] → [支払い] → [退店]

3. ユビキタス言語の策定
   Session, Order, OrderItem, MenuItem...
```

### Phase 2: 戦略的設計

```
1. サブドメインの特定
   ┌───────────────┐
   │ コアドメイン   │ ← 注力すべき領域
   ├───────────────┤
   │ サポート       │
   ├───────────────┤
   │ 汎用          │ ← 既存ツール活用
   └───────────────┘

2. 境界付けられたコンテキストの定義
   顧客コンテキスト
   調理コンテキスト
   会計コンテキスト
   メニュー管理コンテキスト

3. コンテキストマップの作成
   コンテキスト間の関係性を明確化
```

### Phase 3: 戦術的設計

```
1. エンティティと値オブジェクトの識別
   
   エンティティ:
   - Session（ID持つ、状態変化）
   - Order（ID持つ、状態変化）
   - MenuItem（ID持つ、価格変更）
   
   値オブジェクト:
   - Money（金額 + 通貨）
   - PartySize（来店人数）
   - SessionStatus（セッション状態）

2. 集約の設計
   
   Session集約:
   ┌─────────────────┐
   │ Session (Root)  │
   ├─────────────────┤
   │ - Order[]       │ ← 集約内エンティティ
   │ - StaffCall[]   │
   └─────────────────┘
   
   ビジネスルール:
   - ACTIVEの時のみ注文追加可能
   - 会計依頼中は新規注文不可

3. ドメインサービスの抽出
   
   PaymentCalculationService:
   - Session全体の合計金額計算
   - キャンセル注文の除外

4. リポジトリインターフェースの定義
   
   interface SessionRepository {
     save(session: Session): Promise<void>;
     findByTableId(tableId: string): Promise<Session[]>;
   }
```

### Phase 4: 実装

```typescript
// 1. ドメイン層の実装
// domain/model/order/Order.ts
export class Order {
  private constructor(
    private readonly id: OrderId,
    private sessionId: SessionId,
    private items: OrderItem[],
    private status: OrderStatus
  ) {}
  
  static create(sessionId: SessionId): Order {
    return new Order(
      OrderId.generate(),
      sessionId,
      [],
      OrderStatus.pending()
    );
  }
  
  addItem(menuItem: MenuItem, quantity: number): void {
    // ビジネスルールの適用
    if (!this.canAddItem()) {
      throw new OrderAlreadyConfirmedException();
    }
    
    this.items.push(OrderItem.create(menuItem, quantity));
  }
  
  private canAddItem(): boolean {
    return this.status.isPending();
  }
}

// 2. アプリケーション層の実装
// application/usecase/PlaceOrderUseCase.ts
export class PlaceOrderUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private orderRepository: OrderRepository,
    private menuItemRepository: MenuItemRepository
  ) {}
  
  async execute(command: PlaceOrderCommand): Promise<void> {
    // 集約の取得
    const session = await this.sessionRepository.findById(
      new SessionId(command.sessionId)
    );
    
    if (!session) {
      throw new SessionNotFoundException();
    }
    
    // ビジネスロジックの実行
    const order = session.placeOrder();
    
    for (const item of command.items) {
      const menuItem = await this.menuItemRepository.findById(
        new MenuItemId(item.menuItemId)
      );
      
      order.addItem(menuItem, item.quantity);
    }
    
    // 永続化
    await this.orderRepository.save(order);
    await this.sessionRepository.save(session);
  }
}

// 3. インフラ層の実装
// infrastructure/persistence/PrismaOrderRepository.ts
export class PrismaOrderRepository implements OrderRepository {
  async save(order: Order): Promise<void> {
    await prisma.order.upsert({
      where: { id: order.getId().value },
      update: this.toData(order),
      create: this.toData(order),
    });
  }
}

// 4. プレゼンテーション層の実装
// api/OrderController.ts
export class OrderController {
  constructor(private placeOrderUseCase: PlaceOrderUseCase) {}
  
  async placeOrder(req: Request, res: Response): Promise<void> {
    const command = new PlaceOrderCommand(
      req.body.sessionId,
      req.body.items
    );
    
    await this.placeOrderUseCase.execute(command);
    
    res.status(201).json({ message: '注文を受け付けました' });
  }
}
```

### Phase 5: 継続的な改善

```
1. ユビキタス言語の進化
   - 新しい概念の追加
   - 曖昧な用語の明確化
   - 不要な用語の削除

2. モデルのリファクタリング
   - より深い洞察に基づく再設計
   - ビジネスルールの追加・変更

3. コンテキスト境界の見直し
   - 責任の再分配
   - 新しいコンテキストの追加
```

---

## telBotOrderプロジェクトでの適用例

### 1. ドメインモデルの設計

```typescript
// Session集約
export class Session {
  private constructor(
    private readonly id: SessionId,
    private tableId: TableId,
    private partySize: PartySize,
    private status: SessionStatus,
    private orders: Order[] = []
  ) {}
  
  // ファクトリメソッド
  static start(
    table: Table,
    partySize: number,
    telegramChatId: string
  ): Session {
    return new Session(
      SessionId.generate(),
      table.getId(),
      new PartySize(partySize),
      SessionStatus.active(),
      []
    );
  }
  
  // ビジネスロジック
  placeOrder(): Order {
    if (!this.canPlaceOrder()) {
      throw new CannotPlaceOrderException(
        '会計依頼中は注文できません'
      );
    }
    
    const order = Order.create(this.id);
    this.orders.push(order);
    
    return order;
  }
  
  requestPayment(): void {
    if (this.orders.length === 0) {
      throw new NoOrdersException(
        '注文がないため会計できません'
      );
    }
    
    this.status = SessionStatus.paymentRequested();
  }
  
  private canPlaceOrder(): boolean {
    return this.status.isActive();
  }
}

// 値オブジェクト
export class PartySize {
  private readonly value: number;
  
  constructor(value: number) {
    if (value < 1 || value > 20) {
      throw new InvalidPartySizeException(
        '来店人数は1〜20人の範囲で指定してください'
      );
    }
    this.value = value;
  }
  
  getValue(): number {
    return this.value;
  }
}

export class SessionStatus {
  private constructor(private readonly value: string) {}
  
  static active(): SessionStatus {
    return new SessionStatus('ACTIVE');
  }
  
  static paymentRequested(): SessionStatus {
    return new SessionStatus('PAYMENT_REQUESTED');
  }
  
  static completed(): SessionStatus {
    return new SessionStatus('COMPLETED');
  }
  
  isActive(): boolean {
    return this.value === 'ACTIVE';
  }
}
```

### 2. レイヤードアーキテクチャ

```
┌─────────────────────────────────────┐
│ プレゼンテーション層                  │
│ - REST API Controllers              │
│ - GraphQL Resolvers                 │
│ - Telegram Bot Handlers             │
└─────────────────────────────────────┘
         ↓ 依存
┌─────────────────────────────────────┐
│ アプリケーション層                    │
│ - Use Cases                         │
│ - DTOs                              │
│ - Application Services              │
└─────────────────────────────────────┘
         ↓ 依存
┌─────────────────────────────────────┐
│ ドメイン層                           │
│ - Entities                          │
│ - Value Objects                     │
│ - Domain Services                   │
│ - Repository Interfaces             │
└─────────────────────────────────────┘
         ↑ 実装
┌─────────────────────────────────────┐
│ インフラ層                           │
│ - Repository Implementations        │
│ - Database (Prisma)                 │
│ - External APIs                     │
└─────────────────────────────────────┘
```

### 3. ディレクトリ構造

```
server/
├── src/
│   ├── domain/                    # ドメイン層
│   │   ├── model/
│   │   │   ├── session/
│   │   │   │   ├── Session.ts           # 集約ルート
│   │   │   │   ├── SessionId.ts         # 値オブジェクト
│   │   │   │   ├── SessionStatus.ts     # 値オブジェクト
│   │   │   │   ├── PartySize.ts         # 値オブジェクト
│   │   │   │   └── SessionRepository.ts # リポジトリIF
│   │   │   ├── order/
│   │   │   │   ├── Order.ts
│   │   │   │   ├── OrderItem.ts
│   │   │   │   └── OrderRepository.ts
│   │   │   └── menu/
│   │   │       ├── MenuItem.ts
│   │   │       └── MenuItemRepository.ts
│   │   └── service/
│   │       └── PaymentCalculationService.ts
│   │
│   ├── application/               # アプリケーション層
│   │   ├── usecase/
│   │   │   ├── StartSessionUseCase.ts
│   │   │   ├── PlaceOrderUseCase.ts
│   │   │   └── RequestPaymentUseCase.ts
│   │   └── dto/
│   │       ├── SessionDto.ts
│   │       └── OrderDto.ts
│   │
│   ├── infrastructure/            # インフラ層
│   │   ├── persistence/
│   │   │   ├── PrismaSessionRepository.ts
│   │   │   └── PrismaOrderRepository.ts
│   │   └── external/
│   │       └── TelegramClient.ts
│   │
│   └── presentation/              # プレゼンテーション層
│       ├── api/
│       │   ├── SessionController.ts
│       │   └── OrderController.ts
│       └── bot/
│           └── TelegramBotHandler.ts
```

---

## DDDのベストプラクティス

### 1. ドメイン層を純粋に保つ

```typescript
// ✅ OK: ドメインロジックのみ
class Order {
  confirm(): void {
    if (this.items.length === 0) {
      throw new DomainException('商品がありません');
    }
    this.status = OrderStatus.confirmed();
  }
}

// ❌ NG: インフラへの依存
class Order {
  async confirm(): Promise<void> {
    // データベースへの直接アクセス
    await prisma.order.update({ ... });
  }
}
```

### 2. ビジネスルールをドメインモデルに集約

```typescript
// ✅ OK: ドメインモデルにルール
class Session {
  canAddOrder(): boolean {
    return this.status.isActive();
  }
}

// ❌ NG: コントローラーにルール
class OrderController {
  async placeOrder(req: Request): Promise<void> {
    if (session.status === 'PAYMENT_REQUESTED') {
      throw new Error('会計依頼中');
    }
  }
}
```

### 3. 不変条件（Invariant）を守る

```typescript
class Order {
  private items: OrderItem[] = [];
  
  // ✅ OK: 集約ルート経由でのみ変更
  addItem(item: OrderItem): void {
    if (this.items.length >= 50) {
      throw new Error('50商品まで');
    }
    this.items.push(item);
  }
  
  // ❌ NG: 直接変更を許すと不変条件が守れない
  // getItems(): OrderItem[] {
  //   return this.items;
  // }
  
  // ✅ OK: 読み取り専用
  getItems(): ReadonlyArray<OrderItem> {
    return this.items;
  }
}
```

---

## まとめ

### DDDの本質

```
┌─────────────────────────────────────┐
│ ビジネスの複雑さ                     │
│         ↓                           │
│ ドメインモデルに表現                 │
│         ↓                           │
│ コードとして実装                     │
│         ↓                           │
│ 保守可能なソフトウェア               │
└─────────────────────────────────────┘

キーポイント:
1. ビジネスとコードの一致
2. ユビキタス言語による共通理解
3. 境界付けられたコンテキスト
4. ドメインモデルの中心性
```

### DDDが適している場合

```
✅ 適している:
- 複雑なビジネスロジック
- 長期運用されるシステム
- 頻繁な仕様変更
- ドメインエキスパートとの協力が可能

❌ 不要な場合:
- CRUDだけのシンプルなシステム
- 短期間のプロトタイプ
- ビジネスロジックがほとんどない
```

### 学習リソース

**書籍**:
- Eric Evans, "Domain-Driven Design: Tackling Complexity in the Heart of Software"
- Vaughn Vernon, "Implementing Domain-Driven Design"
- Vaughn Vernon, "Domain-Driven Design Distilled"

**オンラインリソース**:
- Martin Fowler's Blog (martinfowler.com)
- DDD Community (dddcommunity.org)

---

**作成日**: 2025-11-27  
**プロジェクト**: telBotOrder  
**バージョン**: 1.0
