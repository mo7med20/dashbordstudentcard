import { createMemo, createSignal, For, Show } from 'solid-js';
import './App.css';

function App(props) {
  const [data] = createSignal(props.data);


  const positiveTypes = createMemo(() =>
    data().degreesSettings.filter((value) => value.degree === 1)
  );

  const negativeTypes = createMemo(() =>
    data().degreesSettings.filter((value) => value.degree === -1)
  );

  const positivePoints = createMemo(() =>
    positiveTypes().reduce(
      (total, value) => total + value.totalCount * value.degree,
      0
    )
  );


  const negativePoints = createMemo(() =>
    negativeTypes().reduce(
      (total, value) => total + value.totalCount * value.degree,
      0
    )
  );

  const positiveTotal = createMemo(() =>
    positiveTypes().reduce(
      (total, value) => total + value.countLimit * Math.abs(value.degree),
      0
    )
  );


  const negativeTotal = createMemo(() =>
    negativeTypes().reduce(
      (total, value) => total + value.countLimit * Math.abs(value.degree),
      0
    )
  );
  
  const getSelectedBadges = () => {
    return data().badgeSettings.filter(badge => badge.selected);
  };

  // Get current rank progress
  const getCurrentRankProgress = () => {
    const totalBadges = getSelectedBadges().length;
    const currentRank = data().selectedRank;
    const nextRank = data().rankSettings.find(r => r.count > totalBadges);
    
    return {
      current: currentRank,
      next: nextRank,
      progress: nextRank ? (totalBadges / nextRank.count) * 100 : 100,
      totalBadges
    };
  };

  // Translate degree names to Arabic
  const translateDegreeName = (name) => {
    const translations = {
      'true_contribute': 'المشاركات',
      'wrong_contribute': 'مشاركة خاطئة',
      'perfect': 'الإتقان',
      'not_perfect': 'عدم إتقان',
      'retain': 'الحفظ',
      'not_retain': 'عدم حفظ',
      'special': 'متميز',
      'polite': 'مؤدب',
      'resolved_assignment': 'الواجبات',
      'not_resolved_assignment': 'عدم حل الواجب',
      'sleep_during_lecture': 'نوم أثناء الحصة',
      'cooperative': 'المشاركة',
      'seditious': 'مثير للفتنة',
      'indifference': 'لامبالاة',
      'forgot_book': 'نسيان الكتاب',
      'practical_application': 'التطبيق العملي',
      'project_completion': 'إنجاز مشروع'
    };
    return translations[name] || name;
  };

  // Translate badge names to Arabic
  const translateBadgeName = (name) => {
    const translations = {
      'star_of_week': 'نجم الأسبوع',
      'reading': 'القراءة',
      'participation': 'المشاركة',
      'special': 'متميز',
      'distinguished': 'مميز'
    };
    return translations[name] || name;
  };

  // Translate rank names to Arabic
  const translateRankName = (name) => {
    const translations = {
      'beginner': 'مبتدئ',
      'active': 'نشط',
      'special': 'متميز',
      'professional': 'محترف',
      'legend': 'أسطوري'
    };
    return translations[name] || name;
  };

  const rankProgress = getCurrentRankProgress();
  // const totalPoints = calculateTotalPoints();
  // const maxPoints = calculateMaxPoints();
  const progressPercentagePositive = ((positivePoints() / positiveTotal()) * 100).toFixed(0);
  console.log(progressPercentagePositive)
  const progressPercentageNegative = ((negativePoints() / negativeTotal()) * 100).toFixed(0);

  // Get positive and negative counts
  const getPositiveCount = () => {
    return data().degreesSettings
      .filter(d => d.totalCount > 0)
      .reduce((sum, d) => sum + d.totalCount, 0);
  };

  const getNegativeCount = () => {
    return Math.abs(data().degreesSettings
      .filter(d => d.totalCount < 0)
      .reduce((sum, d) => sum + d.totalCount, 0));
  };

  return (
    <div class="dashboard-wrapper">
      <div class="dashboard-grid">
        <div class="right-column">
          
          {/* Student Information Card */}
          <div class="student-info-card">
            <div class="card-header">
              {/* <span class="icon">👤</span> */}
              <h3>معلومات الطالب</h3>
            </div>
            <div class="student-info-content">
              <div class="student-name">{data().student.name}</div>
              <div class="student-details">
                <div class="student-detail-item">
                  <span class="detail-icon">📧</span>
                  <span class="detail-text">{data().student.email}</span>
                </div>
                <div class="student-detail-item">
                  <span class="detail-icon">📱</span>
                  <span class="detail-text">{data().student.phone}</span>
                </div>
                <div class="student-detail-item">
                  <span class="detail-icon">{data().student.isActive ? '✅' : '❌'}</span>
                  <span class="detail-text">{data().student.isActive ? 'نشط' : 'غير نشط'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Evaluation Card */}
          <div class="evaluation-card">
            <div class="card-header">
              <span class="icon">⭐</span>
              <h3>التقدير </h3>
            </div>
            <div class="evaluation-content">
              {/* <div class="evaluation-label">التقدير</div> */}
              <div class="evaluation-status accepted">التقدير الإيجابي</div>
              <div class="evaluation-score">
                <span class="current-score">{positiveTotal}</span>
                <span class="separator">/</span>
                <span class="max-score">{positivePoints}</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style={`width: ${progressPercentagePositive}%`}></div>
              </div>
              <div class="progress-percentage">{progressPercentagePositive}%</div>



              
              <div class="evaluation-content-negative">
                {/* <div class="evaluation-label">التقدير</div> */}
                <div class="evaluation-status accepted-negative">التقدير السلبي</div>
                <div class="evaluation-score">
                  <span class="current-score">{negativeTotal}</span>
                  <span class="separator">/</span>
                  <span class="max-score">{negativePoints}</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill-negative" style={`width: ${progressPercentageNegative}%`}></div>
                </div>
                <div class="progress-percentage">{progressPercentageNegative}%</div>




              <div class="stats-row">
                <div class="stat-item negative">
                  <div class="stat-icon">❌</div>
                  <div class="stat-details">
                    <div class="stat-label">السلبيات</div>
                    <div class="stat-value">{getNegativeCount()} / {data().degreesSettings[0]?.countLimit || 10}</div>
                  </div>
                </div>
                <div class="stat-item positive">
                  <div class="stat-icon">✅</div>
                  <div class="stat-details">
                    <div class="stat-label">الإيجابيات</div>
                    <div class="stat-value">{getPositiveCount()} / {data().degreesSettings[0]?.countLimit || 10}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>




          {/* Personal Recommendations */}
          <div class="recommendations-card">
            <div class="card-header">
              <span class="icon">💡</span>
              <h3>توصيات شخصية</h3>
            </div>
            <div class="recommendations-list">
                <Show
                  when={getNegativeCount() > 0}
                  fallback={
                    <Show when={getPositiveCount() > 5}>
                      <div class="recommendation-item success">
                        <span class="rec-icon">✅</span>
                        <div class="rec-content">
                          <div class="rec-title">ممتاز</div>
                          <div class="rec-text">
                            مستوى الإيجابيات ممتاز! استمر في هذا الأداء المتميز والمشاركة الفعالة.
                          </div>
                        </div>
                      </div>
                    </Show>
                  }
                >
                  <div class="recommendation-item warning">
                    <span class="rec-icon">⚠️</span>
                    <div class="rec-content">
                      <div class="rec-title">تحسين</div>
                      <div class="rec-text">
                        عدد السلبيات المسجلة يحتاج إلى تحسين. يُنصح بالتركيز على تقليل السلوكيات
                        السلبية.
                      </div>
                    </div>
                  </div>
                </Show>

              
              <div class="recommendation-item info">
                <span class="rec-icon">📘</span>
                <div class="rec-content">
                  <div class="rec-title">نصيحة</div>
                  <div class="rec-text">يمكنك تحسين أدائك من خلال زيادة المشاركة والحفظ والتطبيق العملي بشكل منتظم.</div>
                </div>
              </div>

              <Show when={rankProgress.next}>
                <div class="recommendation-item rank">
                  <span class="rec-icon">🏆</span>
                  <div class="rec-content">
                    <div class="rec-title">رتبة قريبة</div>
                    <div class="rec-text">أنت على بُعد {rankProgress.next.count - rankProgress.totalBadges} شارات من الوصول إلى رتبة {translateRankName(rankProgress.next.name)}!</div>
                  </div>
                </div>
              </Show>
            </div>
          </div>

          {/* Badges and Achievements */}
          <div class="badges-achievements-card">
            <div class="card-header">
              <span class="icon">⭐</span>
              <h3>الأوسمة والشارات</h3>
            </div>
            <div class="badges-content">
              <div class="badges-section-header">
                <span>الأوسمة المكتسبة</span>
                {/* <span class="info-icon">ℹ️</span> */}
              </div>
              <div class="badges-grid-small">
                <div class="badge-item-dashed">
                  <span class="badge-icon-small">🏅</span>
                  <span class="badge-name-small">نجم الأسبوع</span>
                </div>
                <div class="badge-item-dashed">
                  <span class="badge-icon-small">📚</span>
                  <span class="badge-name-small">القارئ المميز</span>
                </div>
              </div>
              
              {/* <div class="badges-section-header mt-20">
                <span>الأوسمة المكتسبة</span>
              </div>
              <div class="acquired-badges-list">
                <For each={data().badgeSettings}>
                  {(badge) => (
                    <div class="badge-list-item">
                      <span class="badge-list-icon">{badge.selected ? '✅' : '⭕'}</span>
                      <span class="badge-list-name">{translateBadgeName(badge.name)}</span>
                    </div>
                  )}
                </For>
              </div> */}
            </div>
          </div>
          <div class="recent-activities-card">
            <div class="card-header">
              <span class="icon">🔔</span>
              <h3>المتابعات السلوكية</h3>
            </div>
            <div class="activities-list">
              <For each={data().degreesSettings.filter(d => d.counts.length > 0)}>
                {(degree) => {
                  const lastActivity = degree.counts[degree.counts.length - 1];
                  const date = new Date(lastActivity.date);

                  return (
                    <div class="activity-item">
                      <div class="activity-icon">🔔</div>
                      <div class="activity-details">
                        <div class="activity-title">{translateDegreeName(degree.name)}</div>
                        <div class="activity-date">تاريخ: {date.toLocaleDateString('ar-EG')}</div>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </div>

        </div>

        </div>

        <div class="left-column">

          {/* Degrees Progress Bars */}
          <div class="degrees-bars-card">
            <div class="card-header">
              <span class="icon">📊</span>
              <h3>بطاقة تتبع الدرجات الإجابية</h3>
            </div>
            <div class="degrees-bars-content">
              <For each={data().degreesSettings.filter(d => d.totalCount !== 0)}>
                {(degree) => {
                  const percentage = Math.min((Math.abs(degree.totalCount) / degree.countLimit) * 100, 100);
                  const isPositive = degree.totalCount > 0;

                  return (
                    <>
                      {isPositive && <div class="degree-bar-item">
                        <div class="degree-bar-header">
                          <span class="degree-bar-name">{translateDegreeName(degree.name)}</span>
                          <span class="degree-bar-icon">📋</span>
                        </div>
                        <div class="degree-bar-stats">
                          <span class="degree-bar-count">الحد: {degree.totalCount} / {degree.countLimit}</span>
                        </div>
                        <div class="degree-bar-progress">
                          <div
                            class={`degree-bar-fill positive`}
                            style={`width: ${percentage}%`}
                          ></div>
                        </div>
                        <div class="degree-bar-percentage">{percentage.toFixed(0)}%</div>
                      </div>}
                    </>
                  );
                }}
              </For>
            </div>
          </div>

          <div class="degrees-bars-card">
            <div class="card-header">
              <span class="icon">📊</span>
              <h3>بطاقة تتبع الدرجات السلبية</h3>
            </div>
            <div class="degrees-bars-content">
              <For each={data().degreesSettings.filter(d => d.totalCount !== 0)}>
                {(degree) => {
                  const percentage = Math.min((Math.abs(degree.totalCount) / degree.countLimit) * 100, 100);
                  const isNegative = degree.totalCount < 0;

                  return (
                    <>
                      {isNegative && <div class="degree-bar-item">
                        <div class="degree-bar-header">
                          <span class="degree-bar-name">{translateDegreeName(degree.name)}</span>
                          <span class="degree-bar-icon">📋</span>
                        </div>
                        <div class="degree-bar-stats">
                          <span class="degree-bar-count">الحد: {degree.totalCount} / {degree.countLimit}</span>
                        </div>
                        <div class="degree-bar-progress">
                          <div
                            class={`degree-bar-fill negative`}
                            style={`width: ${percentage}%`}
                          ></div>
                        </div>
                        <div class="degree-bar-percentage">{percentage.toFixed(0)}%</div>
                      </div>}
                    </>

                  );
                }}
              </For>
            </div>
          </div>

          {/* Achievement Analysis */}
          <div class="achievement-analysis-card">
            <div class="card-header">
              <span class="icon">📈</span>
              <h3>تحليل الإنجاز</h3>
            </div>
            {/* <div class="achievement-content">
              <For each={data().degreesSettings.slice(0, 3).filter(d => d.totalCount !== 0)}>
                {(degree, index) => {
                  const icons = ['🏆', '🎖️', '🌟'];
                  const colors = ['#fbbf24', '#f59e0b', '#d97706'];
                  
                  return (
                    <div class="achievement-item" style={`background: ${colors[index()]}`}>
                      <div class="achievement-icon">{icons[index()]}</div>
                      <div class="achievement-details">
                        <div class="achievement-title">{translateDegreeName(degree.name)}</div>
                        <div class="achievement-subtitle">
                          {degree.totalCount > 0 ? 'إيجابي' : 'سلبي'} - {Math.abs(degree.totalCount)} مرة من أصل {degree.countLimit}
                        </div>
                        <div class="achievement-date">آخر تحديث: {new Date(degree.counts[degree.counts.length - 1]?.date || Date.now()).toLocaleDateString('ar-EG')}</div>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div> */}
          </div>

          {/* Rank Distribution */}
          <div class="rank-distribution-card">
            <div class="card-header">
              <span class="icon">📊</span>
              <h3>توزيع الرتب</h3>
            </div>
            <div class="rank-distribution-content">
              <div class="rank-bars">
                <For each={data().rankSettings}>
                  {(rank) => {
                    const isActive = rank.name === data().selectedRank.name;
                    const percentage = (rank.count / 12) * 100;

                    return (
                      <div class="rank-bar-item">
                        <div class="rank-bar-label">
                          <span class={`rank-name ${isActive ? 'active' : ''}`}>{translateRankName(rank.name)}</span>
                          <span class="rank-count">{rank.count}</span>
                        </div>
                        <div class="rank-bar-bg">
                          <div
                            class={`rank-bar-fill ${isActive ? 'active' : ''}`}
                            style={`width: ${percentage}%`}
                          ></div>
                        </div>
                      </div>
                    );
                  }}
                </For>
              </div>
            </div>
          </div>

          {/* Attendance and Warnings */}
          <div class="attendance-warnings-card">
            <div class="card-header">
              <span class="icon">📅</span>
              <h3>الحضور والانصراف</h3>
            </div>
            <div class="attendance-content">
              <div class="attendance-status">
                <span class="status-icon">✅</span>
                <span class="status-text">الحالة: مستمر</span>
              </div>
              <div class="attendance-stats">
                <div class="attendance-stat-item">
                  <div class="stat-icon-large">🎁</div>
                  <div class="stat-number">0</div>
                  <div class="stat-label">الغياب</div>
                </div>
                <div class="attendance-stat-item">
                  <div class="stat-icon-large">⚠️</div>
                  <div class="stat-number">0</div>
                  <div class="stat-label">الإنذارات</div>
                </div>
              </div>
              <div class="attendance-note">
                الانتظام في الحضور أمر مهم لتحسين الأداء الأكاديمي والحصول على شارات إضافية.
              </div>
            </div>
          </div>

          {/* Recent Activities */}


          {/* Note Section */}
          {/* <div class="note-card">
            <div class="note-icon">💡</div>
            <div class="note-content">
              <div class="note-title">نصيحة</div>
              <div class="note-text">
                تعتبر المتابعات المنتظمة والمشاركة الفعالة في الأنشطة الصفية من أهم عوامل النجاح الأكاديمي. 
                احرص على تحسين نقاطك السلبية والاستمرار في تعزيز الإيجابيات لتحقيق أفضل النتائج.
              </div>
            </div>
          </div> */}

        </div>
    </div>
  </div>
  );
};

export default App;
